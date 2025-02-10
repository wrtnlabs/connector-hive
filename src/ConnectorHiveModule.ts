import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { DbModule } from "./modules/db/db.module";
import { HealthModule } from "./modules/health/health.module";
import { IndexModule } from "./modules/index/index.module";
import { RetrieveModule } from "./modules/retrieve/retrieve.module";
import { SemanticModule } from "./modules/semantic/semantic.module";

@Module({
  imports: [
    LoggerModule.forRoot(),
    DbModule,
    HealthModule,
    IndexModule,
    RetrieveModule,
    SemanticModule,
  ],
})
export class ConnectorHiveModule {}
