export class DatabaseConectionError extends Error {
  reason = 'Error connection to DB';
  
  constructor(){
    super();

    // Only because we are extending a builtin class
    Object.setPrototypeOf(this, DatabaseConectionError.prototype);
  }
}