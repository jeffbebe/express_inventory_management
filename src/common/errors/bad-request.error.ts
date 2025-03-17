import { HttpException } from "./http.error";

export class BadRequestException extends HttpException {
  constructor(
    reason: { message: unknown } & Record<string, unknown>,
    message = "Bad request"
  ) {
    super(reason, message);
    this.code = 400;
  }
}
