import typia from "typia";

export namespace ConnectorRetrieveRequest {
  export interface CreateBody {
    /**
     * Query string to search for connectors.
     *
     * It will be trimmed.
     */
    query: string;
    /**
     * Maximum number of connectors to return.
     */
    topK: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Maximum<50>;
  }

  export interface CreateRes {}
}
