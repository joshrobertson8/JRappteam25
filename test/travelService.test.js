"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const travelService_1 = require("../src/services/travelService");
const httpError_1 = require("../src/middleware/httpError");
describe('TravelService', () => {
    beforeEach(() => {
        travelService_1.TravelService.records = [];
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
            const record = await travelService_1.TravelService.create(data);
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
            await expect(travelService_1.TravelService.create(invalidData)).rejects.toThrow(httpError_1.HTTPError);
        });
    });
    describe('list', () => {
        it('should return all records', async () => {
            const data1 = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
            const data2 = { destinationName: 'Tokyo', country: 'Japan', visitDate: '2023-08-20', rating: 4 };
            await travelService_1.TravelService.create(data1);
            await travelService_1.TravelService.create(data2);
            const records = travelService_1.TravelService.list();
            expect(records).toHaveLength(2);
            expect(records[0].destinationName).toBe('Paris');
            expect(records[1].destinationName).toBe('Tokyo');
        });
        it('should return empty array if no records', () => {
            const records = travelService_1.TravelService.list();
            expect(records).toEqual([]);
        });
    });
    describe('get', () => {
        it('should return the record with matching ID', async () => {
            const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
            const created = await travelService_1.TravelService.create(data);
            const record = travelService_1.TravelService.get(created.id);
            expect(record.id).toBe(created.id);
            expect(record.destinationName).toBe('Paris');
        });
        it('should throw error if record not found', () => {
            expect(() => travelService_1.TravelService.get('non-existent-id')).toThrow(httpError_1.HTTPError);
            expect(() => travelService_1.TravelService.get('non-existent-id')).toThrow('Record not found');
        });
    });
    describe('update', () => {
        it('should update the record with valid data', async () => {
            const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
            const created = await travelService_1.TravelService.create(data);
            const updateData = { rating: 4, notes: 'Updated notes' };
            const updated = travelService_1.TravelService.update(created.id, updateData);
            expect(updated.id).toBe(created.id);
            expect(updated.rating).toBe(4);
            expect(updated.notes).toBe('Updated notes');
            expect(updated.updatedAt).toBeDefined();
        });
        it('should throw error if record not found', () => {
            expect(() => travelService_1.TravelService.update('non-existent-id', { rating: 3 })).toThrow(httpError_1.HTTPError);
        });
        it('should throw error for invalid update data', async () => {
            const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
            const created = await travelService_1.TravelService.create(data);
            expect(() => travelService_1.TravelService.update(created.id, { rating: 10 })).toThrow(httpError_1.HTTPError);
        });
    });
    describe('delete', () => {
        it('should delete the record with matching ID', async () => {
            const data = { destinationName: 'Paris', country: 'France', visitDate: '2023-07-15', rating: 5 };
            const created = await travelService_1.TravelService.create(data);
            travelService_1.TravelService.delete(created.id);
            expect(() => travelService_1.TravelService.get(created.id)).toThrow(httpError_1.HTTPError);
            expect(travelService_1.TravelService.list()).toHaveLength(0);
        });
        it('should throw error if record not found', () => {
            expect(() => travelService_1.TravelService.delete('non-existent-id')).toThrow(httpError_1.HTTPError);
            expect(() => travelService_1.TravelService.delete('non-existent-id')).toThrow('Record not found');
        });
    });
});
