import { TypedBody, TypedParam, TypedQuery, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IApplicationConnector } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnector";
import { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrievalRequest";
import typia from "typia";

import { ApplicationConnectorRetrievalService } from "./services/application.connector.retrieval.service";
import { ApplicationConnectorService } from "./services/application.connector.service";

@Controller()
export class ApplicationConnectorController {
  constructor(
    private readonly connector: ApplicationConnectorService,
    private readonly retrieval: ApplicationConnectorRetrievalService,
  ) {}

  /**
   * List all connectors for a given application version, sorted by connector name in ascending alphabetical order.
   * This endpoint uses cursor-based pagination.
   *
   * @param id - ID of the application version.
   * @param limit - Maximum number of connectors to return.
   * @param cursor - Cursor (connector name) to start the list from.
   *                 - If provided, the list will return connectors whose names
   *                   are lexicographically *greater than* the given cursor.
   *                 - If not provided (undefined), the list will start
   *                   from the first connector (in alphabetical order).
   *                 - To get the next page of results, use the `name` (or a
   *                   similarly named property representing the connector name) of
   *                   the last connector in the current page as the
   *                   `cursor` for the next request.
   *
   * @returns List of connectors.
   */
  @TypedRoute.Get("application-versions/by-ids/:id/connectors")
  async list(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Minimum<100>,
    @TypedQuery() cursor: IApplicationConnector.ICursor | undefined,
  ): Promise<IApplicationConnector[]> {
    return this.connector.list(id, limit, cursor);
  }

  /**
   * List all connectors for a given name across all versions.
   *
   * @param name - Name of the connector.
   * @param limit - Maximum number of connectors to return.
   * @param cursor - Cursor (version number) to start the list from.
   *
   * @returns List of connectors.
   */
  @TypedRoute.Get("connectors/by-names/:name/all-versions")
  async listAllVersions(
    @TypedParam("name") name: string,
    @TypedQuery()
    limit: number &
      typia.tags.Type<"uint32"> &
      typia.tags.Minimum<1> &
      typia.tags.Minimum<100>,
    @TypedQuery() cursor: IApplicationConnector.ICursorAllVersions | undefined,
  ): Promise<IApplicationConnector[]> {
    return this.connector.listAllVersions(name, limit, cursor);
  }

  /**
   * Get a connector by its ID.
   *
   * @param id - ID of the connector.
   *
   * @returns Connector.
   */
  @TypedRoute.Get("connectors/by-ids/:id")
  async getById(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<IApplicationConnector> {
    return this.connector.getById(id);
  }

  /**
   * Get a connector by its name.
   *
   * @param id - ID of the application version.
   * @param name - Name of the connector.
   *
   * @returns Connector.
   */
  @TypedRoute.Get("application-versions/by-ids/:id/connectors/by-names/:name")
  async getByName(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedParam("name") name: string,
  ): Promise<IApplicationConnector> {
    return this.connector.getByName(id, name);
  }

  /**
   * Create a new connector.
   *
   * @param id - ID of the application version.
   * @param body - Connector to create.
   *
   * @returns Created connector.
   */
  @TypedRoute.Post("application-versions/by-ids/:id/connectors")
  async create(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
    @TypedBody() body: IApplicationConnector.ICreate,
  ): Promise<IApplicationConnector> {
    return this.connector.create(id, body);
  }

  /**
   * Delete a connector.
   *
   * @param id - ID of the connector.
   */
  @TypedRoute.Delete("connectors/by-ids/:id")
  async remove(
    @TypedParam("id") id: string & typia.tags.Format<"uuid">,
  ): Promise<void> {
    return this.connector.remove(id);
  }

  /**
   * Perform connector retrieval. It searches for connectors that match the query semantically,
   * using embeddings, and returns them sorted by relevance in descending order (most relevant first).
   *
   * @param body - Connector retrieval request, including the query, limit, and optional filters.
   * @param body.query - The search query string.  Describe the desired connector's functionality
   *                     in natural language.  Be as specific as possible, including details
   *                     about actions, objects, and any additional features.
   *                     Examples:
   *                       - "Send an email with a subject and body."
   *                       - "Send an email using an HTML body, including CC and BCC support."
   *                       - "Send an email with file attachments."
   *                       - "Schedule sending an email at a specific date and time."
   *                       - "Retrieve data from a Google Sheet and send it as an email."
   * @param body.limit - Maximum number of connectors to return. Must be a non-negative integer.
   * @param body.filter - (Optional) Filter criteria to narrow down the search by application version.
   *                      Filters by application ID or name, and optionally by version number.
   *                      If multiple filters are provided, they are combined with an OR operation.
   *                      If no filter is provided, all connectors are considered.
   *
   * @returns List of connectors, sorted by semantic similarity to the query.
   */
  @TypedRoute.Post("connector-retrievals")
  async createRetrievalRequest(
    @TypedBody() body: IApplicationConnectorRetrieval.ICreate,
  ): Promise<IApplicationConnector[]> {
    return this.retrieval.retrieve(body);
  }
}
