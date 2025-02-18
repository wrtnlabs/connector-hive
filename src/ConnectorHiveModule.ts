import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";

import { AuthModule } from "./modules/auth/auth.module";
import { ConnectorModule } from "./modules/connector/connector.module";
import { DbModule } from "./modules/db/db.module";
import { ExceptionModule } from "./modules/exception/exception.module";
import { UnauthorizedExceptionFilter } from "./modules/exception/unauthorized.exception.filter";
import { HealthModule } from "./modules/health/health.module";
import { SemanticModule } from "./modules/semantic/semantic.module";

@Module({
  imports: [
    LoggerModule.forRoot(),
    AuthModule,
    ExceptionModule,
    DbModule,
    HealthModule,
    SemanticModule,
    ConnectorModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
})
export class ConnectorHiveModule {}
