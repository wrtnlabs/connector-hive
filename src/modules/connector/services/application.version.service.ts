import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IApplicationVersion } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationVersion";
import { DbService } from "@wrtnlabs/connector-hive/modules/db/db.service";
import typia from "typia";

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
   * @param limit - Maximum number of versions to return.
   * @param cursor - Cursor to start from.
   *
   * @returns List of versions.
   */
  async list(
    applicationId: string & typia.tags.Format<"uuid">,
    limit: number & typia.tags.Type<"uint32">,
    cursor?: IApplicationVersion.ICursor,
  ): Promise<IApplicationVersion[]> {
    const where: Prisma.ApplicationVersionWhereInput = {
      applicationId,
    };

    if (cursor?.version) {
      where.version = {
        lt: cursor.version,
      };
    }

    const versions = await this.db.applicationVersion.findMany({
      where,
      orderBy: {
        version: "desc",
      },
      take: limit,
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
   * @param applicationId - ID of the application.
   * @param version - Version number.
   *
   * @returns Created version.
   */
  async create(
    applicationId: string & typia.tags.Format<"uuid">,
    version: number,
  ): Promise<IApplicationVersion> {
    const created = await this.db.applicationVersion.create({
      data: { applicationId, version },
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
  }

  /**
   * Remove a version by its ID.
   *
   * @param id - ID of the version.
   */
  async remove(id: string & typia.tags.Format<"uuid">): Promise<void> {
    await this.db.applicationVersion.delete({
      where: { id },
    });
  }
}
