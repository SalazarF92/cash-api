export class HttpError extends Error {
  status: number;
  message: any;
  constructor(status: number, message: any) {
    super(message);
    this.status = status;
    this.message = message;
  }
}