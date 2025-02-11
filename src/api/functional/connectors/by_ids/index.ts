/**
 * @packageDocumentation
 * @module api.functional.connectors.by_ids
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IApplicationConnector } from "../../../structures/connector/IApplicationConnector";

/**
 * Get a connector by its ID.
 *
 * @param id - ID of the connector.
 * @returns Connector.
 * @tags connector
 *
 * @controller ApplicationConnectorController.getById
 * @path GET /connectors/by-ids/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getById(
  connection: IConnection,
  id: string & Format<"uuid">,
): Promise<getById.Output> {
  return !!connection.simulate
    ? getById.simulate(connection, id)
    : PlainFetcher.fetch(connection, {
        ...getById.METADATA,
        template: getById.METADATA.path,
        path: getById.path(id),
      });
}
export namespace getById {
  export type Output = IApplicationConnector;

  export const METADATA = {
    method: "GET",
    path: "/connectors/by-ids/:id",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = (id: string & Format<"uuid">) =>
    `/connectors/by-ids/${encodeURIComponent(id?.toString() ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): IApplicationConnector => typia.random<IApplicationConnector>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}

/**
 * Delete a connector.
 *
 * @param id - ID of the connector.
 * @tags connector
 *
 * @controller ApplicationConnectorController.remove
 * @path DELETE /connectors/by-ids/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function remove(
  connection: IConnection,
  id: string & Format<"uuid">,
): Promise<void> {
  return !!connection.simulate
    ? remove.simulate(connection, id)
    : PlainFetcher.fetch(connection, {
        ...remove.METADATA,
        template: remove.METADATA.path,
        path: remove.path(id),
      });
}
export namespace remove {
  export const METADATA = {
    method: "DELETE",
    path: "/connectors/by-ids/:id",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = (id: string & Format<"uuid">) =>
    `/connectors/by-ids/${encodeURIComponent(id?.toString() ?? "null")}`;
  export const random = (g?: Partial<typia.IRandomGenerator>): void =>
    typia.random<void>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
  ): void => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
