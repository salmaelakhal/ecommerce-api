import type { Request, Response, NextFunction } from 'express';


import { ErrorCode, HttpException } from './exceptions/root';
import { InternalException } from './exceptions/internal-exception';
import { ZodError } from 'zod';
import { BadRequestsException } from './exceptions/bad-requests';

// Wrapper pour gérer les erreurs sur les routes (sync et async)
export const errorHandler = (methode: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Si la route est async, on attend son résultat
      await methode(req, res, next);
    } catch (error: any) {
      let exception: HttpException;

      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException("Unprocessable entity", ErrorCode.VALIDATION_ERROR, error.issues);
        }else{
          exception = new InternalException('Something went wrong', error, ErrorCode.INTERNAL_EXCEPTION);
        }
      }

      next(exception);
    }
  };
};