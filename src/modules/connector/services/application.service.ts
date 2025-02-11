import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IApplication } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplication";
import { DbService } from "@wrtnlabs/connector-hive/modules/db/db.service";
import typia from "typia";

/**
 * Service for managing applications.
 */
@Injectable()
export class ApplicationService {
  constructor(private readonly db: DbService) {}

  /**
   * List all applications.
   *
   * @param query - Query parameters.
   *
   * @returns List of applications.
   */
  async list(query: IApplication.IListQuery): Promise<IApplication[]> {
    const where: Prisma.ApplicationWhereInput = {};

    if (query.lastName != null) {
      where.name = {
        gt: query.lastName,
      };
    }

    const applications = await this.db.application.findMany({
      where,
      orderBy: [
        {
          name: "asc",
        },
      ],
      take: query.limit,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return applications.map((application) => ({
      id: application.id,
      name: application.name,
      description: application.description ?? undefined,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    }));
  }

  /**
   * Get an application by its ID.
   *
   * @param id - ID of the application.
   *
   * @returns Application.
   */
  async getById(id: string & typia.tags.Format<"uuid">): Promise<IApplication> {
    const application = await this.db.application.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (application == null) {
      throw new NotFoundException(`application not found for id '${id}'`);
    }

    return {
      id,
      name: application.name,
      description: application.description ?? undefined,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }

  /**
   * Get an application by its name.
   *
   * @param name - Name of the application.
   *
   * @returns Application.
   */
  async getByName(name: string): Promise<IApplication> {
    const application = await this.db.application.findUnique({
      where: {
        name,
      },
      select: {
        id: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (application == null) {
      throw new NotFoundException(`application not found for name '${name}'`);
    }

    return {
      id: application.id,
      name,
      description: application.description ?? undefined,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }

  /**
   * Create a new application.
   *
   * @param application - Application to create.
   *
   * @returns Created application.
   */
  async create(application: IApplication.ICreate): Promise<IApplication> {
    try {
      const created = await this.db.application.create({
        data: {
          name: application.name,
          description:
            application.description === undefined
              ? null
              : application.description,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id: created.id,
        name: application.name,
        description: application.description ?? undefined,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `application name '${application.name}' already exists`,
          );
        }
      }

      throw error;
    }
  }

  /**
   * Update an application.
   *
   * @param id - ID of the application to update.
   * @param application - Application to update.
   *
   * @returns Updated application.
   */
  async update(
    id: string & typia.tags.Format<"uuid">,
    application: IApplication.IUpdate,
  ): Promise<IApplication> {
    try {
      const updated = await this.db.application.update({
        where: {
          id,
        },
        data: {
          name: application.name === undefined ? Prisma.skip : application.name,
          description:
            application.description === undefined
              ? Prisma.skip
              : application.description,
        },
        select: {
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        id,
        name: updated.name,
        description: updated.description ?? undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `application name '${application.name}' already exists`,
          );
        }
      }

      throw error;
    }
  }

  /**
   * Remove an application.
   *
   * @param id - ID of the application to remove.
   */
  async remove(id: string & typia.tags.Format<"uuid">): Promise<void> {
    try {
      await this.db.application.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`application not found for id '${id}'`);
        }
      }

      throw error;
    }
  }
}
