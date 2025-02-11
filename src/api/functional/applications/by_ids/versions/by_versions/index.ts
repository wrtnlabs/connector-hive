/**
 * @packageDocumentation
 * @module api.functional.applications.by_ids.versions.by_versions
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IApplicationVersion } from "../../../../../structures/connector/IApplicationVersion";

/**
 * Get a version of an application by its version number.
 *
 * @param id - ID of the application.
 * @param version - Version number.
 * @returns Application version.
 * @tag application-version
 *
 * @controller ApplicationVersionController.getByVersion
 * @path GET /applications/by-ids/:id/versions/by-versions/:version
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getByVersion(
  connection: IConnection,
  id: string & Format<"uuid">,
  version: number,
): Promise<getByVersion.Output> {
  return !!connection.simulate
    ? getByVersion.simulate(connection, id, version)
    : PlainFetcher.fetch(connection, {
        ...getByVersion.METADATA,
        template: getByVersion.METADATA.path,
        path: getByVersion.path(id, version),
      });
}
export namespace getByVersion {
  export type Output = IApplicationVersion;

  export const METADATA = {
    method: "GET",
    path: "/applications/by-ids/:id/versions/by-versions/:version",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 200,
  } as const;

  export const path = (id: string & Format<"uuid">, version: number) =>
    `/applications/by-ids/${encodeURIComponent(id?.toString() ?? "null")}/versions/by-versions/${encodeURIComponent(version?.toString() ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): IApplicationVersion => typia.random<IApplicationVersion>(g);
  export const simulate = (
    connection: IConnection,
    id: string & Format<"uuid">,
    version: number,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id, version),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    assert.param("version")(() => typia.assert(version));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
