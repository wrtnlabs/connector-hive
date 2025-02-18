import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConnectorHiveConfiguration } from "@wrtnlabs/connector-hive/ConnectorHiveConfiguration";
import { UnauthorizedExceptionWithErrorAndDescription } from "@wrtnlabs/connector-hive/modules/exception/UnauthorizedExceptionWithErrorAndDescription";
import { Request } from "express";
import { Observable } from "rxjs";

export enum AuthGuardError {
  NO_API_KEY = "no-api-key",
  INVALID_API_KEY_FORMAT = "invalid-api-key-format",
  INVALID_API_KEY = "invalid-api-key",
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const apiKey = ConnectorHiveConfiguration.API_KEY();

    if (apiKey == null) {
      // API Key is not set, so we should allow all requests
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const apiKeyFromReq = req.headers.authorization;

    if (apiKeyFromReq == null) {
      throw new UnauthorizedExceptionWithErrorAndDescription(
        AuthGuardError.NO_API_KEY,
        "no api key provided",
      );
    }

    if (!apiKeyFromReq.startsWith("Bearer ")) {
      throw new UnauthorizedExceptionWithErrorAndDescription(
        AuthGuardError.INVALID_API_KEY_FORMAT,
        "invalid api key format",
      );
    }

    const token = apiKeyFromReq.slice(7).trim();

    if (token !== apiKey) {
      throw new UnauthorizedExceptionWithErrorAndDescription(
        AuthGuardError.INVALID_API_KEY,
        "invalid api key",
      );
    }

    return true;
  }
}
