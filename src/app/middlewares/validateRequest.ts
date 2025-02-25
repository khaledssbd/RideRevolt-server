import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import tryCatchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return tryCatchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      // validation (if everything is alright next() will be called)
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      next();
    },
  );
};

export default validateRequest;
