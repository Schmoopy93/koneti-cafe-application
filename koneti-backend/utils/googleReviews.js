import { google } from 'googleapis';
import { logger } from './logger.js';

// Google Places API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// Alternative: Use API key if service account is not available
const useApiKey = !process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

let places;
if (!useApiKey) {
  places = google.places({ version: 'v1', auth });
} else {
  places = google.places({
    version: 'v1',
    auth: process.env.GOOGLE_PLACES_API_KEY
  });
}

// Cache za reviews da se smanji broj API poziva
let reviewsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minuta

/**
 * Dohvata recenzije sa Google Places API
 * @param {string} placeId - Google Place ID vašeg biznisa
 * @returns {Promise<Array>} - Niz recenzija
 */
export const fetchGoogleReviews = async (placeId) => {
  try {
    // Proveri cache
    if (reviewsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
      logger.info('Vraćam recenzije iz cache-a');
      return reviewsCache;
    }

    if (!placeId) {
      throw new Error('GOOGLE_PLACE_ID nije definisan u environment varijablama');
    }

    logger.info(`Dohvatanje recenzija sa Google Places API za place ID: ${placeId}`);

    let response;

    if (useApiKey) {
      // Koristi API key
      response = await places.places.get({
        name: `places/${placeId}`,
        fields: 'reviews'
      });
    } else {
      // Koristi service account
      response = await places.places.get({
        name: `places/${placeId}`,
        fields: 'reviews'
      });
    }

    if (!response.data || !response.data.reviews) {
      logger.warn('Nema recenzija u Google Places odgovoru');
      return [];
    }

    // Transformiši recenzije u format kompatibilan sa postojećim sistemom
    const transformedReviews = response.data.reviews.map(review => ({
      _id: review.name.split('/').pop(), // Koristi review ID kao _id
      name: review.authorAttribution?.displayName || 'Anonimni korisnik',
      email: '', // Google ne daje email
      rating: review.rating || 5,
      comment: review.text?.text || review.originalText?.text || 'Bez komentara',
      status: 'approved', // Sve Google recenzije su automatski odobrene
      createdAt: review.publishTime || new Date().toISOString(),
      // Dodatni Google specifični podaci
      googleReviewId: review.name,
      googleProfilePhotoUrl: review.authorAttribution?.photoUri || null,
      googleTimeDescription: review.relativePublishTimeDescription || null
    }));

    // Sačuvaj u cache
    reviewsCache = transformedReviews;
    cacheTimestamp = Date.now();

    logger.info(`Uspešno dohvaćeno ${transformedReviews.length} recenzija sa Google Places`);

    return transformedReviews;

  } catch (error) {
    logger.error('Greška pri dohvatanju recenzija sa Google Places API:', error);

    // Fallback na praznu listu ili cache ako postoji
    if (reviewsCache) {
      logger.warn('Vraćam stare recenzije iz cache-a zbog greške');
      return reviewsCache;
    }

    throw error;
  }
};

/**
 * Čisti cache recenzija
 */
export const clearReviewsCache = () => {
  reviewsCache = null;
  cacheTimestamp = null;
  logger.info('Cache recenzija je očišćen');
};

/**
 * Testira konekciju sa Google Places API
 */
export const testGooglePlacesConnection = async (placeId) => {
  try {
    if (!placeId) {
      throw new Error('GOOGLE_PLACE_ID nije definisan');
    }

    const response = await places.places.get({
      name: `places/${placeId}`,
      fields: 'displayName,formattedAddress'
    });

    logger.info('Google Places API konekcija uspešna:', response.data);
    return true;
  } catch (error) {
    logger.error('Greška pri testiranju Google Places API konekcije:', error);
    return false;
  }
};
