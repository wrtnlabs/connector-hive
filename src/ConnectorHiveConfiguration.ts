import fs from "fs";
import path from "path";

import { ConnectorHiveGlobal } from "./ConnectorHiveGlobal";

export namespace ConnectorHiveConfiguration {
  export const API_PORT = () =>
    Number(ConnectorHiveGlobal.env.PROJECT_API_PORT);
  export const DATABASE_URL = () => ConnectorHiveGlobal.env.DATABASE_URL;
  export const COHERE_API_KEY = () => ConnectorHiveGlobal.env.COHERE_API_KEY;

  export const ROOT = (() => {
    const splitted: string[] = __dirname.split(path.sep);
    return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
      ? path.resolve(__dirname + "/../..")
      : fs.existsSync(__dirname + "/.env")
        ? __dirname
        : path.resolve(__dirname + "/..");
  })();
}
