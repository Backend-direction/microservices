import { CustomError } from "./custom-erros";

export class DatabaseConectionError extends CustomError {
  reason = 'Error connection to DB';
  statusCode = 500;
  
  constructor(){
    super('Error conneting to DB');

    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, DatabaseConectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ];
  }
}