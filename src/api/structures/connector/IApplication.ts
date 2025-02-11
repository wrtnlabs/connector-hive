import typia from "typia";

/**
 * Represents an application that "owns" the connectors.
 */
export interface IApplication {
  id: string & typia.tags.Format<"uuid">;
  name: string;
  description: string | undefined;
  createdAt: string & typia.tags.Format<"date-time">;
  updatedAt: string & typia.tags.Format<"date-time">;
}

export namespace IApplication {
  /**
   * DTO for listing applications.
   */
  export interface IListQuery {
    /**
     * The maximum number of applications to return.
     */
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Maximum<100>;

    /**
     * Cursor for paginating applications.
     * Put the last application's name in the previous request to get the next page of results.
     */
    lastName?: string;
  }

  /**
   * DTO for creating an application.
   */
  export interface ICreate {
    /**
     * The name of the application.
     */
    name: string;

    /**
     * The description of the application.
     */
    description: string | undefined;
  }

  /**
   * DTO for updating an application partially.
   * `null` will delete that property.
   */
  export interface IUpdate {
    /**
     * The name of the application.
     */
    name: string | undefined;

    /**
     * The description of the application.
     */
    description: string | null | undefined;
  }
}
