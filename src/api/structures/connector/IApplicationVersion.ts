import typia from "typia";

/**
 * Represents a version of an application.
 *
 * Each version must be unique for an application.
 *
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
   * Cursor for paginating through versions.
   */
  export interface ICursor {
    /**
     * The version of the application.
     */
    version: number;
  }

  /**
   * DTO for creating a new version of an application.
   */
  export interface ICreate {
    /**
     * The version of the application.
     */
    version: number;
  }
}
