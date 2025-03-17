export class HttpException extends Error {
  code: number;
  reason: Record<string, unknown>;
  constructor(
    reason: { message: unknown } & Record<string, unknown>,
    message = "Http exception"
  ) {
    super(message);
    this.reason = reason;
  }
}
