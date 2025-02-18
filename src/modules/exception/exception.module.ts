import { Module } from "@nestjs/common";

import { UnauthorizedExceptionFilter } from "./unauthorized.exception.filter";

@Module({
  providers: [UnauthorizedExceptionFilter],
  exports: [UnauthorizedExceptionFilter],
})
export class ExceptionModule {}
