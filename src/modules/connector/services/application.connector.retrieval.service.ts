import { Injectable } from "@nestjs/common";
import { ApplicationConnector, Prisma, PrismaClient } from "@prisma/client";
import { ITXClientDenyList } from "@prisma/client/runtime/library";
import { IApplicationConnector } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnector";
import { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";
import { DbService } from "@wrtnlabs/connector-hive/modules/db/db.service";
import {
  SemanticCohereService,
  SemanticInputType,
} from "@wrtnlabs/connector-hive/modules/semantic/services/semantic.cohere.service";
import typia, { assertGuard } from "typia";

/**
 * Service for retrieving connectors from the database.
 */
@Injectable()
export class ApplicationConnectorRetrievalService {
  constructor(
    private cohere: SemanticCohereService,
    private readonly db: DbService,
  ) {}

  /**
   * Retrieve connectors from the database.
   *
   * @param request - Request for retrieving connectors.
   *
   * @returns List of connectors.
   */
  async retrieve(
    request: IApplicationConnectorRetrieval.ICreate,
  ): Promise<IApplicationConnectorRetrieval.IRetrievedConnector[]> {
    return await this.db.$transaction(async (db) => {
      const versionIds =
        request.filter != null && request.filter.applications.length !== 0
          ? await listMatchedApplicationVersionIds(
              db,
              request.filter.applications,
            )
          : null;

      if (versionIds != null && versionIds.length === 0) {
        return [];
      }

      const embedding = await this.cohere.embed(
        request.query,
        SemanticInputType.Query,
      );

      const whereIn =
        versionIds != null
          ? Prisma.sql`AND c."versionId" = ANY(UNNEST(${versionIds}::uuid[]))`
          : Prisma.empty;

      const connectors = await db.$queryRaw`
        SELECT
          c."id",
          ANY_VALUE(c."versionId") AS "versionId",
          ANY_VALUE(c."name") AS "name",
          ANY_VALUE(c."description") AS "description",
          ANY_VALUE(c."createdAt") AS "createdAt",
          MIN(i."embedding" OPERATOR(extensions.<=>) ${embedding}::extensions.halfvec(384)) AS "distance"
        FROM "public"."ApplicationConnector" c
        INNER JOIN "public"."ApplicationConnectorIndex" i ON c."id" = i."connectorId"
        WHERE TRUE ${whereIn}
        GROUP BY c."id"
        ORDER BY "distance" ASC
        LIMIT ${request.limit}::integer
      `;

      interface IRawConnector {
        id: string & typia.tags.Format<"uuid">;
        versionId: string & typia.tags.Format<"uuid">;
        name: string;
        description: string | null;
        createdAt: Date;
        distance: number;
      }

      assertGuard<IRawConnector[]>(connectors);

      return connectors.map((result) => {
        return {
          id: result.id,
          versionId: result.versionId,
          name: result.name,
          description: result.description ?? undefined,
          createdAt: result.createdAt.toISOString(),
          distance: result.distance,
        };
      });
    });
  }
}

/**
 * List all application version IDs that match the given application filters.
 *
 * @param db - Database client.
 * @param applications - Application filters.
 *
 * @returns List of application version IDs.
 */
async function listMatchedApplicationVersionIds(
  db: Omit<PrismaClient, ITXClientDenyList>,
  applications: IApplicationConnectorRetrieval.IFilterApplication[],
): Promise<(string & typia.tags.Format<"uuid">)[]> {
  const orList: Prisma.ApplicationVersionWhereInput[] = [];

  for (const application of applications) {
    const where: Prisma.ApplicationVersionWhereInput = {};

    switch (application.type) {
      case "byId":
        where.applicationId = application.id;
        break;
      case "byName":
        where.application = {
          name: application.name,
        };
        break;
    }

    if (application.version !== undefined) {
      where.version = application.version;
    }

    orList.push(where);
  }

  const applicationVersions = await db.applicationVersion.findMany({
    where: {
      OR: orList,
    },
    select: {
      id: true,
    },
    distinct: ["id"],
  });

  return applicationVersions.map((applicationVersion) => applicationVersion.id);
}
