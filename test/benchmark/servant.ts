import { DynamicBenchmarker } from "@nestia/benchmark";

import { ConnectorHiveConfiguration } from "../../src/ConnectorHiveConfiguration";

DynamicBenchmarker.servant({
  connection: {
    host: `http://127.0.0.1:${ConnectorHiveConfiguration.API_PORT()}`,
  },
  location: `${__dirname}/../features`,
  parameters: (connection) => [connection],
  prefix: "test_api_",
}).catch((exp) => {
  console.error(exp);
  process.exit(-1);
});
