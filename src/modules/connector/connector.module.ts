import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "@wrtnlabs/connector-hive/modules/auth/auth.module";
import { AuthGuard } from "@wrtnlabs/connector-hive/modules/auth/services/auth.guard";
import { SemanticModule } from "@wrtnlabs/connector-hive/modules/semantic/semantic.module";

import { ApplicationConnectorController } from "./application.connector.controller";
import { ApplicationController } from "./application.controller";
import { ApplicationVersionController } from "./application.version.controller";
import { ApplicationConnectorRetrievalService } from "./services/application.connector.retrieval.service";
import { ApplicationConnectorService } from "./services/application.connector.service";
import { ApplicationService } from "./services/application.service";
import { ApplicationVersionService } from "./services/application.version.service";

@Module({
  imports: [AuthModule, SemanticModule],
  providers: [
    ApplicationService,
    ApplicationConnectorService,
    ApplicationVersionService,
    ApplicationConnectorRetrievalService,
  ],
  exports: [
    ApplicationService,
    ApplicationConnectorService,
    ApplicationVersionService,
    ApplicationConnectorRetrievalService,
  ],
  controllers: [
    ApplicationController,
    ApplicationVersionController,
    ApplicationConnectorController,
  ],
})
export class ConnectorModule {}
