import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IApplicationConnector } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnector";
import { DbService } from "@wrtnlabs/connector-hive/modules/db/db.service";
import {
  SemanticCohereService,
  SemanticInputType,
} from "@wrtnlabs/connector-hive/modules/semantic/services/semantic.cohere.service";
import typia from "typia";

/**
 * Service for managing application connectors.
 */
@Injectable()
export class ApplicationConnectorService {
  constructor(
    private readonly cohere: SemanticCohereService,
    private readonly db: DbService,
  ) {}

  /**
   * List all connectors for a given version.
   *
   * @param versionId - ID of the version.
   * @param query - Query parameters.
   *
   * @returns List of connectors.
   */
  async list(
    versionId: string & typia.tags.Format<"uuid">,
    query: IApplicationConnector.IListQuery,
  ): Promise<IApplicationConnector[]> {
    const where: Prisma.ApplicationConnectorWhereInput = {
      versionId,
    };

    if (query.lastName != null) {
      where.name = {
        gt: query.lastName,
      };
    }

    const connectors = await this.db.applicationConnector.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      take: query.limit,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    return connectors.map((connector) => ({
      id: connector.id,
      versionId,
      name: connector.name,
      description: connector.description ?? undefined,
      createdAt: connector.createdAt.toISOString(),
    }));
  }

  /**
   * List all connectors for a given name across all versions.
   *
   * @param name - Name of the connector.
   * @param query - Query parameters.
   *
   * @returns List of connectors.
   */
  async listAllVersions(
    name: string,
    query: IApplicationConnector.IListQueryAllVersions,
  ): Promise<IApplicationConnector[]> {
    const where: Prisma.ApplicationConnectorWhereInput = {
      name,
    };

    if (query.lastVersion != null) {
      where.version = {
        version: {
          lt: query.lastVersion,
        },
      };
    }

    const connectors = await this.db.applicationConnector.findMany({
      where,
      orderBy: {
        version: {
          version: "desc",
        },
      },
      take: query.limit,
      select: {
        id: true,
        versionId: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    return connectors.map((connector) => ({
      id: connector.id,
      versionId: connector.versionId,
      name: connector.name,
      description: connector.description ?? undefined,
      createdAt: connector.createdAt.toISOString(),
    }));
  }

  /**
   * Get a connector by its ID.
   *
   * @param id - ID of the connector.
   *
   * @returns Connector.
   */
  async getById(
    id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationConnector> {
    const connector = await this.db.applicationConnector.findUnique({
      where: {
        id,
      },
      select: {
        versionId: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });

    if (connector == null) {
      throw new NotFoundException(`connector not found for id '${id}'`);
    }

    return {
      id,
      versionId: connector.versionId,
      name: connector.name,
      description: connector.description ?? undefined,
      createdAt: connector.createdAt.toISOString(),
    };
  }

  /**
   * Get a connector by its name.
   *
   * @param versionId - ID of the version.
   * @param name - Name of the connector.
   *
   * @returns Connector.
   */
  async getByName(
    versionId: string & typia.tags.Format<"uuid">,
    name: string,
  ): Promise<IApplicationConnector> {
    const connector = await this.db.applicationConnector.findUnique({
      where: {
        versionId_name: {
          versionId,
          name,
        },
      },
      select: {
        id: true,
        description: true,
        createdAt: true,
      },
    });

    if (connector == null) {
      throw new NotFoundException(`connector not found for name '${name}'`);
    }

    return {
      id: connector.id,
      versionId,
      name,
      description: connector.description ?? undefined,
      createdAt: connector.createdAt.toISOString(),
    };
  }

  /**
   * Create a new connector.
   *
   * It also creates an index for the connector in the database.
   *
   * @param versionId - ID of the version.
   * @param connector - Connector to create.
   *
   * @returns Created connector.
   */
  async create(
    versionId: string & typia.tags.Format<"uuid">,
    connector: IApplicationConnector.ICreate,
  ): Promise<IApplicationConnector> {
    return await this.db.$transaction(async (db) => {
      try {
        const created = await db.applicationConnector.create({
          data: {
            versionId,
            name: connector.name,
            description:
              connector.description === undefined
                ? Prisma.skip
                : connector.description,
          },
          select: {
            id: true,
            createdAt: true,
          },
        });

        const query = connector.description ?? connector.name;
        const embedding = await this.cohere.embed(
          query,
          SemanticInputType.Document,
        );

        await this.db.$executeRaw`
          INSERT INTO "public"."ApplicationConnectorIndex" (connectorId, query, embedding)
          VALUES (${created.id}, ${query}, ${embedding})
        `;

        return {
          id: created.id,
          versionId,
          name: connector.name,
          description: connector.description ?? undefined,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new ConflictException(
              `connector name '${connector.name}' already exists in the version '${versionId}'`,
            );
          }

          if (error.code === "P2003") {
            throw new NotFoundException(
              `application version '${versionId}' not found`,
            );
          }
        }

        throw error;
      }
    });
  }

  /**
   * Remove a connector by its ID.
   *
   * @param id - ID of the connector.
   */
  async remove(id: string & typia.tags.Format<"uuid">): Promise<void> {
    await this.db.applicationConnector.delete({
      where: {
        id,
      },
    });
  }
}
