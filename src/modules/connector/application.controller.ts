import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IApplication } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplication";
import typia from "typia";

import { ApplicationService } from "./services/application.service";

@Controller()
export class ApplicationController {
  constructor(private readonly application: ApplicationService) {}

  /**
   * List all applications. The result will be sorted by name in ascending alphabetical order.
   * This endpoint uses cursor-based pagination.
   *
   * @param limit - Maximum number of applications to return.
   * @param cursor - Cursor (application name) to start the list from.
   *                 - If provided, the list will return applications whose names
   *                   are lexicographically *greater than* the given cursor.
   *                 - If not provided (undefined), the list will start
   *                   from the beginning (the first application in alphabetical order).
   *                 - To get the next page of results, use the `name` of the last
   *                   application in the current page as the `cursor` for the next request.
   *
   * @returns List of applications.
   */
  @TypedRoute.Get("applications")
  async list(
    @TypedQuery()
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Minimum<100>,
    @TypedQuery() cursor: IApplication.ICursor | undefined,
  ): Promise<IApplication[]> {
    return this.application.list(limit, cursor);
  }

  /**
   * Get an application by its ID.
   *
   * @param id - ID of the application.
   *
   * @returns Application.
   */
  @TypedRoute.Get("applications/by-ids/:id")
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
   */
  @TypedRoute.Get("applications/by-names/:name")
  async getByName(@TypedParam("name") name: string): Promise<IApplication> {
    return this.application.getByName(name);
  }

  /**
   * Create a new application.
   *
   * @param body - Application to create.
   *
   * @returns Created application.
   */
  @TypedRoute.Post("applications")
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
   */
  @TypedRoute.Put("applications/by-ids/:id")
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
   */
  @TypedRoute.Delete("applications/by-ids/:id")
  async remove(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<void> {
    return this.application.remove(id);
  }
}
