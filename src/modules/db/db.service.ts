import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConnectorHiveConfiguration } from "@wrtnlabs/connector-hive/ConnectorHiveConfiguration";
import { execSync } from "child_process";
import { Logger } from "nestjs-pino";
import path from "path";

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: Logger) {
    super();
  }

  async onModuleInit() {
    try {
      this.logger.debug("applying pending database migrations");

      const prismaPath = path.resolve("node_modules/.bin/prisma");
      execSync(`${prismaPath} migrate deploy`, {
        env: {
          ...process.env,
          DATABASE_URL: ConnectorHiveConfiguration.DATABASE_URL(),
        },
        stdio: "inherit",
      });

      this.logger.debug("connecting to database");
      await this.$connect();
    } catch (error: unknown) {
      console.error("error", error);
      this.logger.error("failed to connect to database", error);
      // Re-throw the error to prevent the application from starting with a broken DB connection
      throw error;
    }
  }
}
