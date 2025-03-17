import { HttpException } from "./http.error";

export class NotFoundException extends HttpException {
  constructor(
    reason: { message: unknown } & Record<string, unknown>,
    message = "Not found"
  ) {
    super(reason, message);
    this.code = 404;
  }
}
