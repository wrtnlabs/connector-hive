import typia from "typia";

export namespace IApplicationConnectorRetrieval {
  /**
   * Represents a single request to retrieve connectors.
   * You can filter the results by applications and their versions.
   */
  export interface ICreate {
    /**
     * The search query string.
     *
     * Describe the desired connector's functionality
     * in natural language. Be as specific as possible, including details
     * about actions, objects, and any additional features.
     */
    query: string &
      typia.tags.Examples<{
        "sending email": "Send an email with a subject and body, including file attachments.";
        "schedule email sending": "Schedule sending an email at a specific date and time.";
        "google sheet to email": "Retrieve data from a Google Sheet and send it as an email.";
      }>;

    /**
     * The maximum number of connectors to return.
     */
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Maximum<100>;

    /**
     * The filter to narrow down the results.
     */
    filter: IFilter | undefined;
  }

  /**
   * Represents a filter to narrow down the results.
   * It can hold multiple application filters. The application filters are applied as an OR operation.
   */
  export interface IFilter {
    /**
     * The application filters.
     */
    applications: IFilterApplication[];
  }

  /**
   * Represents a single filter.
   *
   * This is used to narrow down the results by condition of application.
   * Each filter can refer application by either its ID or name, and optionally by its version.
   * Latest version will be used if version is not specified.
   */
  export type IFilterApplication =
    | IFilterApplicationById
    | IFilterApplicationByName;

  export interface IFilterApplicationBase<T extends string> {
    /**
     * The type of the filter.
     */
    type: T;

    /**
     * The version of the application.
     */
    version: number | undefined;
  }

  /**
   * Filter by application ID.
   */
  export interface IFilterApplicationById
    extends IFilterApplicationBase<"byId"> {
    /**
     * The ID of the application.
     */
    id: string & typia.tags.Format<"uuid">;
  }

  /**
   * Filter by application name.
   */
  export interface IFilterApplicationByName
    extends IFilterApplicationBase<"byName"> {
    /**
     * The name of the application.
     */
    name: string;
  }
}
