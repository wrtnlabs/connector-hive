import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { IApplicationVersion } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationVersion";
import { AttachSwaggerSecurityBearer } from "@wrtnlabs/connector-hive/modules/auth/services/attach.swagger.security.bearer.decorator";
import { AuthGuard } from "@wrtnlabs/connector-hive/modules/auth/services/auth.guard";
import typia from "typia";

import { ApplicationVersionService } from "./services/application.version.service";

@Controller()
@UseGuards(AuthGuard)
export class ApplicationVersionController {
  constructor(private readonly version: ApplicationVersionService) {}

  /**
   * List all versions of an application.
   *
   * List all versions of an application, sorted by version number in descending order.
   * This endpoint uses cursor-based pagination.
   *
   * @param id - ID of the application.
   * @param query - Query parameters.
   *
   * @returns List of application versions.
   *
   * @tag application-version
   */
  @TypedRoute.Get("applications/by-ids/:id/versions")
  @AttachSwaggerSecurityBearer
  async list(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedQuery() query: IApplicationVersion.IList,
  ): Promise<IApplicationVersion[]> {
    return this.version.list(id, query);
  }

  /**
   * Get a version of an application by its ID.
   *
   * @param id - ID of the application version.
   *
   * @returns Application version.
   *
   * @tag application-version
   */
  @TypedRoute.Get("application-versions/by-ids/:id")
  @AttachSwaggerSecurityBearer
  async getById(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    return this.version.getById(id);
  }

  /**
   * Get a version of an application by its version number.
   *
   * @param id - ID of the application.
   * @param version - Version number.
   *
   * @returns Application version.
   *
   * @tag application-version
   */
  @TypedRoute.Get("applications/by-ids/:id/versions/by-versions/:version")
  @AttachSwaggerSecurityBearer
  async getByVersion(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedParam("version") version: number,
  ): Promise<IApplicationVersion> {
    return this.version.getByVersion(id, version);
  }

  /**
   * Get the latest version of an application.
   *
   * @param id - ID of the application.
   *
   * @returns Latest application version.
   *
   * @tag application-version
   */
  @TypedRoute.Get("applications/by-ids/:id/versions/latest")
  @AttachSwaggerSecurityBearer
  async getLatest(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    return this.version.getLatest(id);
  }

  /**
   * Create a new version of an application.
   *
   * If the version is not provided, it will automatically generate a new version number.
   *
   * @param id - ID of the application.
   * @param body - Application version to create.
   *
   * @returns Created application version.
   *
   * @tag application-version
   */
  @TypedRoute.Post("applications/by-ids/:id/versions")
  @AttachSwaggerSecurityBearer
  async create(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedBody() body: IApplicationVersion.ICreate,
  ): Promise<IApplicationVersion> {
    return this.version.create(id, body.version);
  }

  /**
   * Delete a version of an application.
   *
   * @param id - ID of the application version to delete.
   *
   * @tag application-version
   */
  @TypedRoute.Delete("application-versions/by-ids/:id")
  @AttachSwaggerSecurityBearer
  async remove(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<void> {
    return this.version.remove(id);
  }
}
