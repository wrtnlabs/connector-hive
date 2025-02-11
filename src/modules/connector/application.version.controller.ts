import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { IApplicationVersion } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationVersion";
import typia from "typia";

import { ApplicationVersionService } from "./services/application.version.service";

export class ApplicationVersionController {
  constructor(private readonly version: ApplicationVersionService) {}

  /**
   * List all versions of an application, sorted by version number in descending order.
   * This endpoint uses cursor-based pagination.
   *
   * @param id - ID of the application.
   * @param limit - Maximum number of versions to return.
   * @param cursor - Cursor (version number) to start the list from.
   *                 - If provided, the list will return versions whose version numbers
   *                   are *less than* the given cursor.
   *                 - If not provided (undefined), the list will start
   *                   from the latest version (highest version number).
   *                 - To get the next page of results, use the `version` (or a
   *                   similarly named property representing the version number) of
   *                   the last application version in the current page as the
   *                   `cursor` for the next request.
   *
   * @returns List of application versions.
   */
  @TypedRoute.Get("applications/by-ids/:id/versions")
  async list(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedQuery()
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Minimum<100>,
    @TypedQuery() cursor: IApplicationVersion.ICursor | undefined,
  ): Promise<IApplicationVersion[]> {
    return this.version.list(id, limit, cursor);
  }

  /**
   * Get a version of an application by its ID.
   *
   * @param id - ID of the application version.
   *
   * @returns Application version.
   */
  @TypedRoute.Get("application-versions/by-ids/:id")
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
   */
  @TypedRoute.Get("applications/by-ids/:id/versions/by-versions/:version")
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
   */
  @TypedRoute.Get("applications/by-ids/:id/versions/latest")
  async getLatest(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationVersion> {
    return this.version.getLatest(id);
  }

  /**
   * Create a new version of an application.
   *
   * @param id - ID of the application.
   * @param body - Application version to create.
   *
   * @returns Created application version.
   */
  @TypedRoute.Post("applications/by-ids/:id/versions")
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
   */
  @TypedRoute.Delete("application-versions/by-ids/:id")
  async remove(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<void> {
    return this.version.remove(id);
  }
}
