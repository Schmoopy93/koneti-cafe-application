import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Reservation Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/koneti-test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/reservations', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        type: 'biznis',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+381601234567',
        date: '2024-12-25',
        time: '18:00',
        guests: 4
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test User');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        type: 'invalid',
        name: '',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/reservations', () => {
    it('should get all reservations', async () => {
      const response = await request(app)
        .get('/api/reservations')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reservations).toBeDefined();
    });
  });
});