// nestia configuration file
import type sdk from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { ConnectorHiveConfiguration } from "./src/ConnectorHiveConfiguration";
import { ConnectorHiveModule } from "./src/ConnectorHiveModule";

const NESTIA_CONFIG: sdk.INestiaConfig = {
  input: () => NestFactory.create(ConnectorHiveModule),
  output: "src/api",
  swagger: {
    output: "packages/api/swagger.json",
    servers: [
      {
        url: `http://localhost:${ConnectorHiveConfiguration.API_PORT()}`,
        description: "Local Server",
      },
    ],
    beautify: true,
    security: {
      bearer: {
        type: "http",
        scheme: "bearer",
        description: "API_KEY set when launching server",
      },
    },
  },
  distribute: "packages/api",
  primitive: false,
  simulate: true,
};
export default NESTIA_CONFIG;
