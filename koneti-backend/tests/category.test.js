import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Category from '../models/Category.js';

jest.mock('@iamtraction/google-translate', () => {
  return jest.fn(async (text, opts) => ({ text: `${text}-en` }));
});

describe('Category Endpoints', () => {
  let createdId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/koneti-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should return 400 when name.sr is missing on create', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: {}, description: { sr: 'Opis' } })
      .expect(400);

    expect(res.body.message).toBe('name.sr is required');
  });

  it('should auto-translate name.sr to name.en when missing', async () => {
    const body = { name: { sr: 'Kafa' }, icon: 'coffee', description: { sr: 'Topli napitak' } };

    const res = await request(app)
      .post('/api/categories')
      .send(body)
      .expect(201);

    expect(res.body.name.sr).toBe('Kafa');
    expect(res.body.name.en).toBe('Kafa-en');
    expect(res.body.description.sr).toBe('Topli napitak');
    expect(res.body.description.en).toBe('Topli napitak-en');

    createdId = res.body._id;
  });

  it('should list categories sorted by name.sr ascending', async () => {
    await Category.insertMany([
      { name: { sr: 'Čajevi', en: 'Teas' } },
      { name: { sr: 'Aperitivi', en: 'Aperitifs' } },
      { name: { sr: 'Kafe', en: 'Coffees' } }
    ]);

    const res = await request(app).get('/api/categories').expect(200);

    const names = res.body.map(c => c.name.sr);
    expect(names).toEqual(['Aperitivi', 'Kafe', 'Čajevi']);
  });

  it('should update with auto-translation when name.en is missing', async () => {
    const created = await Category.create({ name: { sr: 'Sokovi', en: 'Juices' }, description: { sr: 'hladno', en: 'cold' } });

    const res = await request(app)
      .put(`/api/categories/${created._id}`)
      .send({ name: { sr: 'Limunade' } })
      .expect(200);

    expect(res.body.name.sr).toBe('Limunade');
    expect(res.body.name.en).toBe('Limunade-en');
  });

  it('should update description.en from description.sr when missing', async () => {
    const created = await Category.create({ name: { sr: 'Vina', en: 'Wines' }, description: { sr: 'crna', en: '' } });

    const res = await request(app)
      .put(`/api/categories/${created._id}`)
      .send({ description: { sr: 'bela' } })
      .expect(200);

    expect(res.body.description.sr).toBe('bela');
    expect(res.body.description.en).toBe('bela-en');
  });

  it('should delete a category by id', async () => {
    const created = await Category.create({ name: { sr: 'Piva', en: 'Beers' } });

    const res = await request(app)
      .delete(`/api/categories/${created._id}`)
      .expect(200);

    expect(res.body.message).toBe('Category deleted');

    const found = await Category.findById(created._id);
    expect(found).toBeNull();
  });
});
