/**
 * Seed Positions - Dodavanje osnovnih pozicija
 * Seed Positions - Adding default job positions
 */
import mongoose from 'mongoose';
import Position from './models/Position.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultPositions = [
  { title: 'Konobar/ica' },
  { title: 'Barista' },
  { title: 'Kuvar/ica' },
  { title: 'Menadžer smene' },
  { title: 'Čistač/ica' },
  { title: 'Kasir/ka' },
  { title: 'Dostavljač' }
];

const seedPositions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Obriši postojeće pozicije
    await Position.deleteMany({});
    console.log('Cleared existing positions');

    // Dodaj nove pozicije
    await Position.insertMany(defaultPositions);
    console.log('Default positions added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding positions:', error);
    process.exit(1);
  }
};

seedPositions();