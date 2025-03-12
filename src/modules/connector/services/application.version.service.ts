import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IApplicationVersion } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationVersion";
import { DbService } from "@wrtnlabs/connector-hive/modules/db/db.service";
import { TooManyRequestsError } from "cohere-ai/api";
import typia, { assertGuard } from "typia";

/**
 * Service for managing application versions.
 */
@Injectable()
export class ApplicationVersionService {
  constructor(private db: DbService) {}

  /**
   * List all versions for an application.
   *
   * @param applicationId - ID of the application.
   * @param query - Query parameters.
   *
   * @returns List of versions.
   */
  async list(
    applicationId: string & typia.tags.Format<"uuid">,
    query: IApplicationVersion.IList,
  ): Promise<IApplicationVersion[]> {
    const where: Prisma.ApplicationVersionWhereInput = {
      applicationId,
    };

    if (query.lastVersion != null) {
      where.version = {
        lt: query.lastVersion,
      };
    }

    const versions = await this.db.applicationVersion.findMany({
      where,
      orderBy: {
        version: "desc",
      },
      take: query.limit,
      select: {
        id: true,
        version: true,
        createdAt: true,
      },
    });

    return versions.map((version) => ({
      id: version.id,
      applicationId,
      version: version.version,
      createdAt: version.createdAt.toISOString(),
    }));
  }

  /**
   * Get a version by its ID.
   *
   * @param id - ID of the version.
   *
   * @returns Version.
   */
  async getById(
    id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    const version = await this.db.applicationVersion.findUnique({
      where: { id },
      select: {
        id: true,
        applicationId: true,
        version: true,
        createdAt: true,
      },
    });

    if (version == null) {
      throw new NotFoundException(`version not found for id '${id}'`);
    }

    return {
      id: version.id,
      applicationId: version.applicationId,
      version: version.version,
      createdAt: version.createdAt.toISOString(),
    };
  }

  /**
   * Get a version by its version number.
   *
   * @param applicationId - ID of the application.
   * @param versionNumber - Version number.
   *
   * @returns Version.
   */
  async getByVersion(
    applicationId: string & typia.tags.Format<"uuid">,
    versionNumber: number,
  ): Promise<IApplicationVersion> {
    const version = await this.db.applicationVersion.findUnique({
      where: {
        applicationId_version: { applicationId, version: versionNumber },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (version == null) {
      throw new NotFoundException(
        `version not found for application '${applicationId}' and version '${version}'`,
      );
    }

    return {
      id: version.id,
      applicationId,
      version: versionNumber,
      createdAt: version.createdAt.toISOString(),
    };
  }

  /**
   * Get the latest version for an application.
   *
   * @param applicationId - ID of the application.
   *
   * @returns Latest version.
   */
  async getLatest(
    applicationId: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    const version = await this.db.applicationVersion.findFirst({
      where: { applicationId },
      orderBy: { version: "desc" },
    });

    if (version == null) {
      throw new NotFoundException(
        `no versions found for application '${applicationId}'`,
      );
    }

    return this.getByVersion(applicationId, version.version);
  }

  /**
   * Create a new version for an application.
   *
   * If the version is not provided, the service will automatically generate a new version number.
   *
   * @param applicationId - ID of the application.
   * @param version - Version number.
   *
   * @returns Created version.
   */
  async create(
    applicationId: string & typia.tags.Format<"uuid">,
    version: number | undefined,
  ): Promise<IApplicationVersion> {
    if (version == null) {
      return this.createWithAutoVersion(applicationId);
    }

    return this.createWithVersion(applicationId, version);
  }

  private async createWithVersion(
    applicationId: string & typia.tags.Format<"uuid">,
    version: number,
  ): Promise<IApplicationVersion> {
    try {
      const created = await this.db.applicationVersion.create({
        data: {
          applicationId,
          version,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      return {
        id: created.id,
        applicationId,
        version,
        createdAt: created.createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `version '${version}' for the application '${applicationId}' already exists`,
          );
        }

        if (error.code === "P2003") {
          throw new NotFoundException(
            `application '${applicationId}' not found`,
          );
        }
      }

      throw error;
    }
  }

  private async createWithAutoVersion(
    applicationId: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    for (let attempt = 0; attempt < 5; ++attempt) {
      try {
        return this.db.$transaction(
          async (db) => {
            const created = await db.$queryRaw`
              INSERT INTO "public"."ApplicationVersion" (
                "applicationId",
                "version"
              ) VALUES (
                ${applicationId},
                (
                  SELECT COALESCE(MAX("version"), 0) + 1
                  FROM "public"."ApplicationVersion"
                  WHERE "applicationId" = ${applicationId}
                )
              )
              RETURNING "id", "version", "createdAt"
            `;

            interface IRawApplicationVersion {
              id: string & typia.tags.Format<"uuid">;
              version: number;
              createdAt: Date;
            }

            assertGuard<[IRawApplicationVersion]>(created);

            return {
              id: created[0].id,
              applicationId,
              version: created[0].version,
              createdAt: created[0].createdAt.toISOString(),
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2034"
        ) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 100),
          );
          continue;
        }

        throw error;
      }
    }

    throw new TooManyRequestsError(
      "failed to create version due to multiple concurrent transactions; please retry later",
    );
  }

  /**
   * Remove a version by its ID.
   *
   * @param id - ID of the version.
   */
  async remove(id: string & typia.tags.Format<"uuid">): Promise<void> {
    try {
      await this.db.applicationVersion.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(
            `application version not found for id '${id}'`,
          );
        }
      }

      throw error;
    }
  }
}
