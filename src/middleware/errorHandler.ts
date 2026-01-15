import { NextFunction, Request, Response } from 'express';
import { HTTPError } from './httpError';

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof HTTPError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
}
