/**
 * @packageDocumentation
 * @module api.functional.application_versions.by_ids.connectors
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IApplicationConnector } from "../../../../structures/connector/IApplicationConnector";

export * as by_names from "./by_names";

/**
 * List all connectors for a given application version.
 *
 * List all connectors for a given application version, sorted by connector name in ascending alphabetical order.
 * This endpoint uses cursor-based pagination.
 *
 * @param id - ID of the application version.
 * @param query - Query parameters.
 * @returns List of connectors.
 * @tags connector
 *
 * @controller ApplicationConnectorController.list
 * @path GET /application-versions/by-ids/:id/connectors
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function list(
  connection: IConnection,
  id: string & Format<"uuid">,
  query: IApplicationConnector.IListQuery,
): Promise<list.Output> {
  return !!connection.simulate
    ? list.simulate(connection, id, query)
    : PlainFetcher.fetch(connection, {
        ...list.METADATA,
        template: list.METADATA.path,
        path: list.path(id, query),
      });
}
export namespace list {
  export type Query = IApplicationConnector.IListQuery;
  export type Output = Array<IApplicationConnector>;

  export const METADATA = {
    method: "GET",
    path: "/application-versions/by-ids/:id/connectors",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = (id: string & Format<"uuid">, query: list.Query) => {
    const variables: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query as any))
      if (undefined === value) continue;
      else if (Array.isArray(value))
        value.forEach((elem: any) => variables.append(key, String(elem)));
      else variables.set(key, String(value));
    const location: string = `/application-versions/by-ids/${encodeURIComponent(id?.toString() ?? "null")}/connectors`;
    return 0 === variables.size
      ? location
      : `${location}?${variables.toString()}`;
  };
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Array<IApplicationConnector> =>
    typia.random<Array<IApplicationConnector>>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
    query: IApplicationConnector.IListQuery,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id, query),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    assert.query(() => typia.assert(query));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}

/**
 * Create a new connector.
 *
 * @param id - ID of the application version.
 * @param body - Connector to create.
 * @returns Created connector.
 * @tags connector
 *
 * @controller ApplicationConnectorController.create
 * @path POST /application-versions/by-ids/:id/connectors
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  id: string & Format<"uuid">,
  body: IApplicationConnector.ICreate,
): Promise<create.Output> {
  return !!connection.simulate
    ? create.simulate(connection, id, body)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...create.METADATA,
          template: create.METADATA.path,
          path: create.path(id),
        },
        body,
      );
}
export namespace create {
  export type Input = IApplicationConnector.ICreate;
  export type Output = IApplicationConnector;

  export const METADATA = {
    method: "POST",
    path: "/application-versions/by-ids/:id/connectors",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 201,
  } as const;

  export const path = (id: string & Format<"uuid">) =>
    `/application-versions/by-ids/${encodeURIComponent(id?.toString() ?? "null")}/connectors`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): IApplicationConnector => typia.random<IApplicationConnector>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
    body: IApplicationConnector.ICreate,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    assert.body(() => typia.assert(body));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
