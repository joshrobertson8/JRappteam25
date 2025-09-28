import { TravelRecord } from '../models/travelRecord';
import { HTTPError } from '../middleware/httpError';
import { v4 as uuid } from 'uuid';
import { TravelRecordInputSchema } from '../schemas/travelRecordSchema';
import { flattenZodErrors } from '../utils/flattenZodErrors';

export class TravelService {
  private static records: TravelRecord[] = [];

  /**
   * Creates a new travel record after validating the input data.
   * Optionally fetches current weather data if the `weather` flag is true.
   * @param data - The input data for the new record (unknown type for validation).
   * @param weather - Boolean flag to include current weather data.
   * @returns The newly created TravelRecord.
   * @throws HTTPError if validation fails or weather fetch fails.
   */
  static async create(data: unknown, weather: boolean = false): Promise<TravelRecord> {
    const validatedData = TravelRecordInputSchema.safeParse(data);

    if (!validatedData.success) {
      const details = flattenZodErrors(validatedData.error);
      throw new HTTPError('Validation error', 400, details);
    }

    const clean = validatedData.data;
    let currentWeather: string | undefined;

    if (weather) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            `${clean.destinationName},${clean.country}`
          )}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );

        if (!res.ok) {
          throw new Error(`OpenWeather API error: ${res.statusText}`);
        }

        const weatherData = await res.json();
        currentWeather = weatherData.weather?.[0]?.description;
      } catch (err) {
        throw new HTTPError('Failed to fetch weather data', 502, err);
      }
    }

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
      weather: currentWeather,
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
      throw new HTTPError('Record not found', 404, {
        message: 'No record found with the provided ID',
      });
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

    Object.assign(record, validatedData.data, {
      updatedAt: new Date().toISOString(),
    });

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
      throw new HTTPError('Record not found', 404, {
        message: 'No record found with the provided ID',
      });
    }

    this.records.splice(index, 1);
  }
}
