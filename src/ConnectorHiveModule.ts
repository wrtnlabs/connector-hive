import { Module } from "@nestjs/common";

import { HealthModule } from "./modules/health/health.module";
import { IndexModule } from "./modules/index/index.module";
import { RetrieveModule } from "./modules/retrieve/retrieve.module";

@Module({
  imports: [HealthModule, IndexModule, RetrieveModule],
})
export class ConnectorHiveModule {}
