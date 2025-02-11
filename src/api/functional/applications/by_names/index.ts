/**
 * @packageDocumentation
 * @module api.functional.applications.by_names
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IApplication } from "../../../structures/connector/IApplication";

/**
 * Get an application by its name.
 *
 * @param name - Name of the application.
 * @returns Application.
 * @tags application
 *
 * @controller ApplicationController.getByName
 * @path GET /applications/by-names/:name
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getByName(
  connection: IConnection,
  name: string,
): Promise<getByName.Output> {
  return !!connection.simulate
    ? getByName.simulate(connection, name)
    : PlainFetcher.fetch(connection, {
        ...getByName.METADATA,
        template: getByName.METADATA.path,
        path: getByName.path(name),
      });
}
export namespace getByName {
  export type Output = IApplication;

  export const METADATA = {
    method: "GET",
    path: "/applications/by-names/:name",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = (name: string) =>
    `/applications/by-names/${encodeURIComponent(name?.toString() ?? "null")}`;
  export const random = (g?: Partial<typia.IRandomGenerator>): IApplication =>
    typia.random<IApplication>(g);
  export const simulate = (connection: IConnection, name: string): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(name),
      contentType: "application/json",
    });
    assert.param("name")(() => typia.assert(name));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
