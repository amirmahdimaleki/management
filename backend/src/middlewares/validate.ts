import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";
import { ZodError } from "zod";

export const validate = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    // The ZodError will be caught by our global errorHandler
    return next(error);
  }
};
