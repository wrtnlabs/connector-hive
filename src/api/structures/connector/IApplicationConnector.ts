import typia from "typia";

/**
 * Represents a single connector. Every connector must be related to an application version.
 *
 * You cannot update existing connector. Instead, create a new one with a new application version.
 */
export interface IApplicationConnector {
  /**
   * The ID of the connector.
   */
  id: string & typia.tags.Format<"uuid">;

  /**
   * The ID of the application version.
   */
  versionId: string & typia.tags.Format<"uuid">;

  /**
   * The name of the connector.
   */
  name: string;

  /**
   * The description of the connector.  This field is crucial for semantic search,
   * as it is used to calculate the embedding vector for the connector.
   *
   * Provide a clear and concise description of the connector's functionality,
   * including the actions it performs, the objects it interacts with, and any
   * relevant details. Use natural language and be as specific as possible.
   *
   * If no description is provided, the connector's name will be used for indexing instead.
   *
   * @example "Sends an email with a customizable subject, body, and recipient list."
   * @example "Creates a new task in Asana with a title, description, assignee, and due date."
   * @example "Retrieves data from a Google Sheet and transforms it into a CSV file."
   * @example "Schedules a Zoom meeting and sends invitations to participants."
   */
  description: string | undefined;

  /**
   * The creation date of the connector.
   */
  createdAt: string & typia.tags.Format<"date-time">;
}

export namespace IApplicationConnector {
  /**
   * Cursor for paginating connectors.
   */
  export interface ICursor {
    /**
     * The name of the connector.
     */
    name: string;
  }

  /**
   * Cursor for paginating connectors across all versions.
   */
  export interface ICursorAllVersions {
    /**
     * The version of the connector.
     */
    version: number;
  }

  /**
   * DTO for creating a connector.
   */
  export interface ICreate {
    /**
     * The name of the connector.
     */
    name: string;

    /**
     * The description of the connector.
     */
    description: string | undefined;
  }
}
