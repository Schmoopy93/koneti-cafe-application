import { logger } from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { fetchGoogleReviews, clearReviewsCache, testGooglePlacesConnection } from "../utils/googleReviews.js";

// Get all approved reviews (public) - samo Google recenzije
export const getApprovedReviews = async (req, res) => {
  try {
    if (!process.env.GOOGLE_PLACE_ID) {
      logger.warn('GOOGLE_PLACE_ID nije konfigurisan, vraćam praznu listu');
      return successResponse(res, [], "Nema konfigurisan Google Place ID");
    }

    // Dohvati samo Google recenzije
    const googleReviews = await fetchGoogleReviews(process.env.GOOGLE_PLACE_ID);

    return successResponse(res, googleReviews, "Google recenzije učitane");
  } catch (err) {
    logger.error('Greška pri učitavanju Google recenzija:', err);
    return errorResponse(res, "Greška pri učitavanju recenzija", 500);
  }
};

// Test Google Places API konekcije (admin)
export const testGoogleReviews = async (req, res) => {
  try {
    if (!process.env.GOOGLE_PLACE_ID) {
      return errorResponse(res, "GOOGLE_PLACE_ID nije konfigurisan u environment varijablama", 400);
    }

    const isConnected = await testGooglePlacesConnection(process.env.GOOGLE_PLACE_ID);

    if (isConnected) {
      return successResponse(res, { connected: true }, "Google Places API konekcija uspešna");
    } else {
      return errorResponse(res, "Neuspešna konekcija sa Google Places API", 500);
    }
  } catch (err) {
    logger.error('Greška pri testiranju Google Places API:', err);
    return errorResponse(res, "Greška pri testiranju Google Places API", 500);
  }
};

// Clear Google reviews cache (admin)
export const clearGoogleReviewsCache = async (req, res) => {
  try {
    clearReviewsCache();
    return successResponse(res, { cacheCleared: true }, "Cache Google recenzija je očišćen");
  } catch (err) {
    logger.error('Greška pri čišćenju cache-a:', err);
    return errorResponse(res, "Greška pri čišćenju cache-a", 500);
  }
};
