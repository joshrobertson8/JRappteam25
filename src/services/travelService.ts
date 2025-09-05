import { TravelRecord } from '../models/travelRecord';
import { HTTPError } from '../middleware/httpError';
import { v4 as uuid } from 'uuid';
import { TravelRecordInputSchema } from '../schemas/travelRecordSchema';
import { flattenZodErrors } from '../utils/flattenZodErrors';

/**
 * Service class for managing travel records with CRUD operations.
 * Handles validation, storage, and retrieval of travel data.
 */
export class TravelService {
  private static records: TravelRecord[] = [];

  /**
   * Creates a new travel record after validating the input data.
   * @param data - The input data for the new record (unknown type for validation).
   * @returns The newly created TravelRecord.
   * @throws HTTPError if validation fails.
   */
  static create(data: unknown): TravelRecord {
    const validatedData = TravelRecordInputSchema.safeParse(data);

    if (!validatedData.success) {
      const details = flattenZodErrors(validatedData.error);
      throw new HTTPError('Validation error', 400, details);
    }

    const clean = validatedData.data;

    const newRecord: TravelRecord = {
      id: uuid(),
      destinationName: clean.destinationName,
      country: clean.country,
      visitDate: clean.visitDate,
      rating: clean.rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // optional fields
      type: clean.type,
      notes: clean.notes,
      imageUrl: clean.imageUrl,
      mood: clean.mood,
      highlight: clean.highlight,
      foodHighlight: clean.foodHighlight,
      bucketList: clean.bucketList,
      emoji: clean.emoji,
    };

    this.records.push(newRecord);
    return newRecord;
  }

  /**
   * Retrieves all travel records.
   * @returns An array of all TravelRecord objects.
   */
  static list(): TravelRecord[] {
    return this.records;
  }

  /**
   * Retrieves a specific travel record by its ID.
   * @param id - The unique ID of the record.
   * @returns The TravelRecord with the matching ID.
   * @throws HTTPError if the record is not found.
   */
  static get(id: string): TravelRecord {
    const record = this.records.find((r) => r.id === id);
    if (!record) {
      throw new HTTPError('Record not found', 404);
    }
    return record;
  }

  /**
   * Updates an existing travel record with new data after validation.
   * @param id - The unique ID of the record to update.
   * @param data - The updated data (unknown type for validation).
   * @returns The updated TravelRecord.
   * @throws HTTPError if the record is not found or validation fails.
   */
  static update(id: string, data: unknown): TravelRecord {
    const record = this.get(id);
    const validatedData = TravelRecordInputSchema.partial().safeParse(data);
    if (!validatedData.success) {
      const details = flattenZodErrors(validatedData.error);
      throw new HTTPError('Validation error', 400, details);
    }
    Object.assign(record, validatedData.data, { updatedAt: new Date().toISOString() });
    return record;
  }

  /**
   * Deletes a travel record by its ID.
   * @param id - The unique ID of the record to delete.
   * @throws HTTPError if the record is not found.
   */
  static delete(id: string): void {
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new HTTPError('Record not found', 404);
    }
    this.records.splice(index, 1);
  }
}
