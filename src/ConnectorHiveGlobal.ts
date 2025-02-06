import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

/* eslint-disable */
export class ConnectorHiveGlobal {
  public static testing: boolean = false;
  public static get env(): ConnectorHiveGlobal.IEnvironments {
    return environments.get();
  }
}
export namespace ConnectorHiveGlobal {
  export interface IEnvironments {
    PROJECT_API_PORT: `${number}`;
  }
}

const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<ConnectorHiveGlobal.IEnvironments>(process.env);
});
