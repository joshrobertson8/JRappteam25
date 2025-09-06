import { z } from 'zod';

export const TravelRecordInputSchema = z.object({
  destinationName: z.string(),
  country: z.string(),
  visitDate: z.string(),
  rating: z.number().min(1).max(5),
  type: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  mood: z.string().optional(),
  highlight: z.string().optional(),
  foodHighlight: z.string().optional(),
  bucketList: z.boolean().optional(),
  emoji: z.string().optional(),
});

export const TravelRecordSchema = TravelRecordInputSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  weather: z.string().optional(),
});

export type TravelRecord = z.infer<typeof TravelRecordSchema>;
export type TravelRecordInput = z.infer<typeof TravelRecordInputSchema>;
