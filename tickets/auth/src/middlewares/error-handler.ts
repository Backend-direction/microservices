import { Response, Request, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
 if(err instanceof RequestValidationError) {
  console.log('Request vlidation error');
 }

 if(err instanceof DatabaseConectionError) {
  console.log('Database errror');
 }

  res.status(400).send({
    message: err.message
  });
}