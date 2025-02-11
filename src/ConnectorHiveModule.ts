import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { ConnectorModule } from "./modules/connector/connector.module";
import { DbModule } from "./modules/db/db.module";
import { HealthModule } from "./modules/health/health.module";
import { SemanticModule } from "./modules/semantic/semantic.module";

@Module({
  imports: [
    LoggerModule.forRoot(),
    DbModule,
    HealthModule,
    SemanticModule,
    ConnectorModule,
  ],
})
export class ConnectorHiveModule {}
