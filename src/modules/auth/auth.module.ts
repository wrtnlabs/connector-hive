import { Module } from "@nestjs/common";

import { AuthGuard } from "./services/auth.guard";

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
