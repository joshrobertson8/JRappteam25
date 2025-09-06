import { TravelService } from '../src/services/travelService';
import { HTTPError } from '../src/middleware/httpError';

describe('TravelService', () => {
  beforeEach(() => {
    (TravelService as any).records = [];
  });

  describe('create', () => {
    it('should create a valid travel record', async () => {
      const data = {
        destinationName: 'Paris',
        country: 'France',
        visitDate: '2023-07-15',
        rating: 5,
        notes: 'Amazing trip',
      };

      const record = await TravelService.create(data);

      expect(record).toHaveProperty('id');
      expect(record.destinationName).toBe('Paris');
      expect(record.country).toBe('France');
      expect(record.rating).toBe(5);
      expect(record).toHaveProperty('createdAt');
      expect(record).toHaveProperty('updatedAt');
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        destinationName: '',
        country: 'France',
        visitDate: 'invalid-date',
        rating: 6,
      };

      await expect(TravelService.create(invalidData)).rejects.toThrow(HTTPError);
    });
  });

  describe('list', () => {
    it('should return all records', async () => {
      const data1 = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
      const data2 = { destinationName: 'Tokyo', country: 'Japan', visitDate: '2023-08-20', rating: 4 };

      await TravelService.create(data1);
      await TravelService.create(data2);

      const records = TravelService.list();
      expect(records).toHaveLength(2);
      expect(records[0].destinationName).toBe('Paris');
      expect(records[1].destinationName).toBe('Tokyo');
    });

    it('should return empty array if no records', () => {
      const records = TravelService.list();
      expect(records).toEqual([]);
    });
  });

  describe('get', () => {
    it('should return the record with matching ID', async () => {
      const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
      const created = await TravelService.create(data);

      const record = TravelService.get(created.id);
      expect(record.id).toBe(created.id);
      expect(record.destinationName).toBe('Paris');
    });

    it('should throw error if record not found', () => {
      expect(() => TravelService.get('non-existent-id')).toThrow(HTTPError);
      expect(() => TravelService.get('non-existent-id')).toThrow('Record not found');
    });
  });

  describe('update', () => {
    it('should update the record with valid data', async () => {
      const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
      const created = await TravelService.create(data);

      const updateData = { rating: 4, notes: 'Updated notes' };
      const updated = TravelService.update(created.id, updateData);

      expect(updated.id).toBe(created.id);
      expect(updated.rating).toBe(4);
      expect(updated.notes).toBe('Updated notes');
      expect(updated.updatedAt).toBeDefined();
    });

    it('should throw error if record not found', () => {
      expect(() => TravelService.update('non-existent-id', { rating: 3 })).toThrow(HTTPError);
    });

    it('should throw error for invalid update data', async () => {
      const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
      const created = await TravelService.create(data);

      expect(() => TravelService.update(created.id, { rating: 10 })).toThrow(HTTPError);
    });
  });

  describe('delete', () => {
    it('should delete the record with matching ID', async () => {
      const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
      const created = await TravelService.create(data);

      TravelService.delete(created.id);

      expect(() => TravelService.get(created.id)).toThrow(HTTPError);
      expect(TravelService.list()).toHaveLength(0);
    });

    it('should throw error if record not found', () => {
      expect(() => TravelService.delete('non-existent-id')).toThrow(HTTPError);
      expect(() => TravelService.delete('non-existent-id')).toThrow('Record not found');
    });
  });
});
