import { CustomError } from "./custom-erros";

export class BdaRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BdaRequestError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}