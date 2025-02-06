import { Module } from "@nestjs/common";

import { RetrieveController } from "./retrieve.controller";

@Module({
  controllers: [RetrieveController],
})
export class RetrieveModule {}
