/**
 * @packageDocumentation
 * @module api.functional.applications.by_ids.versions
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IApplicationVersion } from "../../../../structures/connector/IApplicationVersion";

export * as by_versions from "./by_versions";
export * as latest from "./latest";

/**
 * List all versions of an application, sorted by version number in descending order.
 * This endpoint uses cursor-based pagination.
 *
 * @param id - ID of the application.
 * @param query - Query parameters.
 * @returns List of application versions.
 *
 * @controller ApplicationVersionController.list
 * @path GET /applications/by-ids/:id/versions
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function list(
  connection: IConnection,
  id: string & Format<"uuid">,
  query: IApplicationVersion.IList,
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
  export type Query = IApplicationVersion.IList;
  export type Output = Array<IApplicationVersion>;

  export const METADATA = {
    method: "GET",
    path: "/applications/by-ids/:id/versions",
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
    const location: string = `/applications/by-ids/${encodeURIComponent(id?.toString() ?? "null")}/versions`;
    return 0 === variables.size
      ? location
      : `${location}?${variables.toString()}`;
  };
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Array<IApplicationVersion> => typia.random<Array<IApplicationVersion>>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
    query: IApplicationVersion.IList,
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
 * Create a new version of an application.
 *
 * @param id - ID of the application.
 * @param body - Application version to create.
 * @returns Created application version.
 *
 * @controller ApplicationVersionController.create
 * @path POST /applications/by-ids/:id/versions
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  id: string & Format<"uuid">,
  body: IApplicationVersion.ICreate,
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
  export type Input = IApplicationVersion.ICreate;
  export type Output = IApplicationVersion;

  export const METADATA = {
    method: "POST",
    path: "/applications/by-ids/:id/versions",
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
    `/applications/by-ids/${encodeURIComponent(id?.toString() ?? "null")}/versions`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): IApplicationVersion => typia.random<IApplicationVersion>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
    body: IApplicationVersion.ICreate,
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
