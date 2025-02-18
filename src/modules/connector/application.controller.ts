import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { IApplication } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplication";
import { AttachSwaggerSecurityBearer } from "@wrtnlabs/connector-hive/modules/auth/services/attach.swagger.security.bearer.decorator";
import { AuthGuard } from "@wrtnlabs/connector-hive/modules/auth/services/auth.guard";
import typia from "typia";

import { ApplicationService } from "./services/application.service";

@Controller()
@UseGuards(AuthGuard)
export class ApplicationController {
  constructor(private readonly application: ApplicationService) {}

  /**
   * List all applications.
   *
   * List all applications, sorted by name in ascending alphabetical order.
   * This endpoint uses cursor-based pagination.
   *
   * @param query - Query parameters.
   *
   * @returns List of applications.
   *
   * @tag application
   */
  @TypedRoute.Get("applications")
  @AttachSwaggerSecurityBearer
  async list(
    @TypedQuery() query: IApplication.IListQuery,
  ): Promise<IApplication[]> {
    return this.application.list(query);
  }

  /**
   * Get an application by its ID.
   *
   * @param id - ID of the application.
   *
   * @returns Application.
   *
   * @tag application
   */
  @TypedRoute.Get("applications/by-ids/:id")
  @AttachSwaggerSecurityBearer
  async getById(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplication> {
    return this.application.getById(id);
  }

  /**
   * Get an application by its name.
   *
   * @param name - Name of the application.
   *
   * @returns Application.
   *
   * @tag application
   */
  @TypedRoute.Get("applications/by-names/:name")
  @AttachSwaggerSecurityBearer
  async getByName(@TypedParam("name") name: string): Promise<IApplication> {
    return this.application.getByName(name);
  }

  /**
   * Create a new application.
   *
   * @param body - Application to create.
   *
   * @returns Created application.
   *
   * @tag application
   */
  @TypedRoute.Post("applications")
  @AttachSwaggerSecurityBearer
  async create(@TypedBody() body: IApplication.ICreate): Promise<IApplication> {
    return this.application.create(body);
  }

  /**
   * Update an application.
   *
   * @param id - ID of the application to update.
   * @param body - Application to update.
   *
   * @returns Updated application.
   *
   * @tag application
   */
  @TypedRoute.Put("applications/by-ids/:id")
  @AttachSwaggerSecurityBearer
  async update(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedBody() body: IApplication.IUpdate,
  ): Promise<IApplication> {
    return this.application.update(id, body);
  }

  /**
   * Delete an application.
   *
   * @param id - ID of the application to delete.
   *
   * @tag application
   */
  @TypedRoute.Delete("applications/by-ids/:id")
  @AttachSwaggerSecurityBearer
  async remove(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<void> {
    return this.application.remove(id);
  }
}
