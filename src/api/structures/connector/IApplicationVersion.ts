import typia from "typia";

/**
 * Represents a version of an application.
 * Each version must be unique for an application.
 * You cannot update existing version. Instead, create a new one with a new version number.
 */
export interface IApplicationVersion {
  /**
   * The ID of the application version.
   */
  id: string & typia.tags.Format<"uuid">;

  /**
   * The ID of the application.
   */
  applicationId: string & typia.tags.Format<"uuid">;

  /**
   * The version of the application.
   */
  version: number;

  /**
   * The creation date of the application version.
   */
  createdAt: string & typia.tags.Format<"date-time">;
}

export namespace IApplicationVersion {
  /**
   * DTO for listing application versions.
   */
  export interface IList {
    /**
     * The maximum number of versions to return.
     */
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Maximum<100>;

    /**
     * Cursor for paginating versions.
     * Put the last version in the previous request to get the next page of results.
     */
    lastVersion?: number;
  }

  /**
   * DTO for creating a new version of an application.
   */
  export interface ICreate {
    /**
     * The version of the application. You can omit this value to let the service generate a latest version.
     */
    version?: number & typia.tags.Type<"uint32"> & typia.tags.Minimum<1>;
  }
}
