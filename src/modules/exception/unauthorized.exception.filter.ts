import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";

import { UnauthorizedExceptionWithErrorAndDescription } from "./UnauthorizedExceptionWithErrorAndDescription";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (!(exception instanceof UnauthorizedExceptionWithErrorAndDescription)) {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
      return;
    }

    const realm = "api access";
    const error = exception.errorCode;
    const errorDescription = exception.errorDescription;

    response
      .status(status)
      .header(
        "WWW-Authenticate",
        `Bearer realm="${realm}", error="${error}", error_description="${errorDescription}"`,
      )
      .json({
        statusCode: status,
        message: exception.message,
      });
  }
}
