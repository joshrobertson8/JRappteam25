export interface TravelRecord {
  id: string;
  destinationName: string;
  country: string;
  visitDate: string;
  rating: number;
  createdAt: string;
  updatedAt: string;

  // optional fields
  type?: string;
  notes?: string;
  imageUrl?: string;
  mood?: string;
  highlight?: string;
  foodHighlight?: string;
  bucketList?: boolean;
  emoji?: string;
}
