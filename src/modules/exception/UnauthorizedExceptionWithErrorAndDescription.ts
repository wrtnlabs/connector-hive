import { UnauthorizedException } from "@nestjs/common";

export class UnauthorizedExceptionWithErrorAndDescription extends UnauthorizedException {
  constructor(
    public errorCode: string,
    public errorDescription: string,
  ) {
    super(errorCode, errorDescription);
  }
}
