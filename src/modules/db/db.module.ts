import { Module } from "@nestjs/common";

import { DbService } from "./db.service";

@Module({
  providers: [DbService],
})
export class DbModule {}
