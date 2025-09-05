import { TravelRecord } from '../models/travelRecord';
import { HTTPError } from '../middleware/httpError';
import { v4 as uuid } from 'uuid';

let records: TravelRecord[] = [];

export function addRecord(data: Partial<TravelRecord>): TravelRecord {
  console.log('addRecord API hit with data:', data);

  if (!data.destinationName || !data.country || !data.visitDate || !data.rating) {
    throw new HTTPError('Missing required fields: destinationName, country, visitDate, rating ', 400);
  }

  // Type validations for required fields
  if (typeof data.destinationName !== 'string') {
    throw new HTTPError('Destination name must be a string', 400);
  }
  if (typeof data.country !== 'string') {
    throw new HTTPError('Country must be a string', 400);
  }
  if (typeof data.visitDate !== 'string') {
    throw new HTTPError('Visit date must be a string', 400);
  }
  if (typeof data.rating !== 'number') {
    throw new HTTPError('Rating must be a number', 400);
  }

  if (data.rating < 1 || data.rating > 5) {
    throw new HTTPError('Rating must be between 1 and 5', 400);
  }

  // Type validations for optional fields
  if (data.userId && typeof data.userId !== 'string') {
    throw new HTTPError('User ID must be a string', 400);
  }
  if (data.type && typeof data.type !== 'string') {
    throw new HTTPError('Type must be a string', 400);
  }
  if (data.notes && typeof data.notes !== 'string') {
    throw new HTTPError('Notes must be a string', 400);
  }
  if (data.imageUrl && typeof data.imageUrl !== 'string') {
    throw new HTTPError('Image URL must be a string', 400);
  }
  if (data.mood && typeof data.mood !== 'string') {
    throw new HTTPError('Mood must be a string', 400);
  }
  if (data.highlight && typeof data.highlight !== 'string') {
    throw new HTTPError('Highlight must be a string', 400);
  }
  if (data.foodHighlight && typeof data.foodHighlight !== 'string') {
    throw new HTTPError('Food highlight must be a string', 400);
  }
  if (data.bucketList !== undefined && typeof data.bucketList !== 'boolean') {
    throw new HTTPError('Bucket list must be a boolean', 400);
  }
  if (data.emoji && typeof data.emoji !== 'string') {
    throw new HTTPError('Emoji must be a string', 400);
  }

  const newRecord: TravelRecord = {
    id: uuid(), // backend generates
    userId: data.userId || 'guest', // default for now
    destinationName: data.destinationName,
    country: data.country,
    visitDate: data.visitDate,
    rating: data.rating,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // optional fields
    type: data.type,
    notes: data.notes,
    imageUrl: data.imageUrl,
    mood: data.mood,
    highlight: data.highlight,
    foodHighlight: data.foodHighlight,
    bucketList: data.bucketList,
    emoji: data.emoji,
  };

  records.push(newRecord);
  console.log('Record added successfully:', newRecord);
  return newRecord;
}

export function getRecords(): TravelRecord[] {
  console.log('getRecords API hit, returning records:', records);
  return records;
}
