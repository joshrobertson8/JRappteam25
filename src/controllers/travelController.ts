import { Request, Response } from 'express';
import * as travelService from '../services/travelService';
import { HTTPError } from '../middleware/httpError';

export function createRecord(req: Request, res: Response): void {
  console.log('POST /api/travel-records hit with body:', req.body);
  try {
    const newRecord = travelService.addRecord(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  }
}

export function getRecords(req: Request, res: Response): void {
  try {
    const records = travelService.getRecords();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
}
