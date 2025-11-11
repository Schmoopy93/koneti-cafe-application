import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Career from '../models/Career.js';
import cloudinary from '../middleware/cloudinary.js';

describe('Career Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/koneti-test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/career', () => {
    it('should create a new career application', async () => {
      const applicationData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+381601234567',
        position: 'Barista',
        coverLetter: 'I am interested in this position.'
      };

      const response = await request(app)
        .post('/api/career')
        .send(applicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Test');
      expect(response.body.data.lastName).toBe('User');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        firstName: '',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/career')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/career', () => {
    it('should get all career applications', async () => {
      const response = await request(app)
        .get('/api/career')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/career/:id/download-cv', () => {
    it('should download CV if exists', async () => {
      // First create an application with CV
      const application = new Career({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+381601234567',
        position: 'Barista',
        coverLetter: 'I am interested in this position.',
        cvUrl: 'https://res.cloudinary.com/example/cv.pdf',
        cloudinary_id: 'career/cv_1234567890_cv.pdf'
      });
      await application.save();

      const response = await request(app)
        .get(`/api/career/${application._id}/download-cv`)
        .expect(302); // Redirect to Cloudinary

      expect(response.headers.location).toContain('cloudinary');
    });

    it('should return 404 if application not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/career/${fakeId}/download-cv`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Prijava nije pronađena.');
    });

    it('should return 404 if CV not found', async () => {
      const application = new Career({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+381601234567',
        position: 'Barista',
        coverLetter: 'I am interested in this position.'
      });
      await application.save();

      const response = await request(app)
        .get(`/api/career/${application._id}/download-cv`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('CV fajl nije pronađen.');
    });
  });
});
