import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Logger } from "nestjs-pino";

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: Logger) {
    super();
  }

  async onModuleInit() {
    try {
      this.logger.debug("connecting to database");
      await this.$connect();
    } catch (error: unknown) {
      this.logger.error("failed to connect to database", error);
    }
  }
}
