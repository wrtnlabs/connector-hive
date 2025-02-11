import typia from "typia";

/**
 * Represents a single connector. Every connector must be related to an application version.
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
   * The description of the connector.
   *
   * This field is crucial for semantic search,
   * as it is used to calculate the embedding vector for the connector.
   *
   * Provide a clear and concise description of the connector's functionality,
   * including the actions it performs, the objects it interacts with, and any
   * relevant details. Use natural language and be as specific as possible.
   *
   * If no description is provided, the connector's name will be used for indexing instead.
   */
  description:
    | (string &
        typia.tags.Examples<{
          "sending email": "Sends an email with a customizable subject, body, and recipient list.";
          "creating task in asana": "Creates a new task in Asana with a title, description, assignee, and due date.";
          "retrieving data from google sheet": "Retrieves data from a Google Sheet and transforms it into a CSV file.";
          "scheduling zoom meeting": "Schedules a Zoom meeting and sends invitations to participants.";
        }>)
    | undefined;

  /**
   * The creation date of the connector.
   */
  createdAt: string & typia.tags.Format<"date-time">;
}

export namespace IApplicationConnector {
  /**
   * DTO for listing connectors.
   */
  export interface IListQuery {
    /**
     * The maximum number of connectors to return.
     */
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Maximum<100>;

    /**
     * Cursor for paginating connectors.
     * Put the last connector's name in the previous request to get the next page of results.
     */
    lastName?: string;
  }

  /**
   * DTO for listing connectors across all versions.
   */
  export interface IListQueryAllVersions {
    /**
     * The maximum number of connectors to return.
     */
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Minimum<100>;

    /**
     * Cursor for paginating connectors across all versions.
     * Put the last connector's version in the previous request to get the next page of results.
     */
    lastVersion?: number;
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
     *
     * This field is crucial for semantic search,
     * as it is used to calculate the embedding vector for the connector.
     *
     * Provide a clear and concise description of the connector's functionality,
     * including the actions it performs, the objects it interacts with, and any
     * relevant details. Use natural language and be as specific as possible.
     *
     * If no description is provided, the connector's name will be used for indexing instead.
     */
    description: (string | undefined) &
      typia.tags.Examples<{
        "sending email": "Sends an email with a customizable subject, body, and recipient list.";
        "creating task in asana": "Creates a new task in Asana with a title, description, assignee, and due date.";
        "retrieving data from google sheet": "Retrieves data from a Google Sheet and transforms it into a CSV file.";
        "scheduling zoom meeting": "Schedules a Zoom meeting and sends invitations to participants.";
      }>;
  }
}
