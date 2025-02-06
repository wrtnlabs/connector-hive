import { DynamicExecutor } from "@nestia/e2e";
import api from "@wrtnlabs/connector-hive-api";
import chalk from "chalk";

import { ConnectorHiveBackend } from "../src/ConnectorHiveBackend";
import { ConnectorHiveConfiguration } from "../src/ConnectorHiveConfiguration";
import { ConnectorHiveGlobal } from "../src/ConnectorHiveGlobal";
import { ArgumentParser } from "./helpers/ArgumentParser";

interface IOptions {
  include?: string[];
  exclude?: string[];
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, _prompt, action) => {
    // command.option("--mode <string>", "target mode");
    // command.option("--reset <true|false>", "reset local DB or not");
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");

    return action(async (options) => {
      // if (typeof options.reset === "string")
      //     options.reset = options.reset === "true";
      // options.mode ??= await prompt.select("mode")("Select mode")([
      //     "LOCAL",
      //     "DEV",
      //     "REAL",
      // ]);
      // options.reset ??= await prompt.boolean("reset")("Reset local DB");
      return options as IOptions;
    });
  });

async function main(): Promise<void> {
  // CONFIGURATIONS
  const options: IOptions = await getOptions();
  ConnectorHiveGlobal.testing = true;

  // BACKEND SERVER
  const backend = new ConnectorHiveBackend();
  await backend.open();

  //----
  // CLINET CONNECTOR
  //----
  // DO TEST
  const connection: api.IConnection = {
    host: `http://127.0.0.1:${ConnectorHiveConfiguration.API_PORT()}`,
  };
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test",
    location: __dirname + "/features",
    parameters: () => [
      {
        host: connection.host,
        encryption: connection.encryption,
      },
    ],
    filter: (func) =>
      (!options.include?.length ||
        (options.include ?? []).some((str) => func.includes(str))) &&
      (!options.exclude?.length ||
        (options.exclude ?? []).every((str) => !func.includes(str))),
    onComplete: (exec) => {
      const trace = (str: string) =>
        console.log(`  - ${chalk.green(exec.name)}: ${str}`);
      if (exec.error === null) {
        const elapsed: number =
          new Date(exec.completed_at).getTime() -
          new Date(exec.started_at).getTime();
        trace(`${chalk.yellow(elapsed.toLocaleString())} ms`);
      } else trace(chalk.red(exec.error.name));
    },
  });
  await backend.close();

  const failures: DynamicExecutor.IExecution[] = report.executions.filter(
    (exec) => exec.error !== null,
  );
  if (failures.length === 0) {
    console.log("Success");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  } else {
    for (const f of failures) console.log(f.error);
    process.exit(-1);
  }

  console.log(
    [
      `All: #${report.executions.length}`,
      `Success: #${report.executions.length - failures.length}`,
      `Failed: #${failures.length}`,
    ].join("\n"),
  );
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
