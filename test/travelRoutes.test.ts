import request from 'supertest';
import express from 'express';
import travelRoutes from '../src/routes/travelRoutes';

const app = express();
app.use(express.json());
app.use('/api/travel-records', travelRoutes);

describe('Travel Routes Integration', () => {
  describe('POST /api/travel-records', () => {
    it('should create a new record', async () => {
      const response = await request(app)
        .post('/api/travel-records')
        .send({
          destinationName: 'Paris',
          country: 'France',
          visitDate: '2023-07-15',
          rating: 5,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.destinationName).toBe('Paris');
    });

    it('should return 400 for invalid data', async () => {
      await request(app)
        .post('/api/travel-records')
        .send({
          destinationName: '',
          rating: 6,
        })
        .expect(400);
    });
  });

  describe('GET /api/travel-records', () => {
    it('should return all records', async () => {
      await request(app).post('/api/travel-records').send({
        destinationName: 'Tokyo',
        country: 'Japan',
        visitDate: '2023-08-20',
        rating: 4,
      });

      const response = await request(app).get('/api/travel-records').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/travel-records/:id', () => {
    it('should return a specific record', async () => {
      const createResponse = await request(app).post('/api/travel-records').send({
        destinationName: 'London',
        country: 'UK',
        visitDate: '2023-09-10',
        rating: 3,
      });

      const id = createResponse.body.id;
      const response = await request(app).get(`/api/travel-records/${id}`).expect(200);

      expect(response.body.id).toBe(id);
      expect(response.body.destinationName).toBe('London');
    });

    it('should return 404 for non-existent ID', async () => {
      await request(app).get('/api/travel-records/non-existent-id').expect(404);
    });
  });

  describe('PATCH /api/travel-records/:id', () => {
    it('should update a record', async () => {
      const createResponse = await request(app).post('/api/travel-records').send({
        destinationName: 'Berlin',
        country: 'Germany',
        visitDate: '2023-10-05',
        rating: 4,
      });

      const id = createResponse.body.id;
      const response = await request(app).patch(`/api/travel-records/${id}`).send({ rating: 5, notes: 'Updated' }).expect(200);

      expect(response.body.rating).toBe(5);
      expect(response.body.notes).toBe('Updated');
    });
  });

  describe('DELETE /api/travel-records/:id', () => {
    it('should delete a record', async () => {
      const createResponse = await request(app).post('/api/travel-records').send({
        destinationName: 'Rome',
        country: 'Italy',
        visitDate: '2023-11-15',
        rating: 5,
      });

      const id = createResponse.body.id;
      await request(app).delete(`/api/travel-records/${id}`).expect(204);

      await request(app).get(`/api/travel-records/${id}`).expect(404);
    });
  });
});
