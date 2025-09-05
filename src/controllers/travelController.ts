import { NextFunction, Request, Response } from 'express';
import { TravelService } from '../services/travelService';
import { HTTPError } from '../middleware/httpError';

/**
 * Creates a new travel record.
 * @param req - Express request object containing the record data in body.
 * @param res - Express response object.
 */
export function createRecord(req: Request, res: Response, next: NextFunction): void {
  try {
    const newRecord = TravelService.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves all travel records.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export function getAllRecords(req: Request, res: Response, next: NextFunction): void {
  try {
    const records = TravelService.getAll();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a specific travel record by ID.
 * @param req - Express request object with ID in params.
 * @param res - Express response object.
 */
export function getRecordById(req: Request, res: Response, next: NextFunction): void {
  try {
    const record = TravelService.getById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    next(error);
}

/**
 * Updates an existing travel record.
 * @param req - Express request object with ID in params and update data in body.
 * @param res - Express response object.
 */
export function updateRecord(req: Request, res: Response, next: NextFunction): void {
  try {
    const updatedRecord = TravelService.update(req.params.id, req.body);
    res.status(200).json(updatedRecord);
  } catch (error) {
   next(error)
}

/**
 * Deletes a travel record by ID.
 * @param req - Express request object with ID in params.
 * @param res - Express response object.
 */
export function deleteRecord(req: Request, res: Response, next: NextFunction): void {
  try {
    TravelService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
   next
}
