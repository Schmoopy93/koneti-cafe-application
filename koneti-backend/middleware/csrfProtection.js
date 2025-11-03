import crypto from 'crypto';
import { logger } from '../utils/logger.js';

// In-memory store za CSRF tokene (u produkciji koristiti Redis)
const csrfTokens = new Map();

// Generiši CSRF token
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Middleware za CSRF zaštitu
export const csrfProtection = (req, res, next) => {
  // Preskači CSRF u development mode-u
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // Preskači CSRF za GET zahteve
  if (req.method === 'GET') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionId = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('CSRF token nedostaje');
    return res.status(403).json({
      success: false,
      message: 'CSRF token je obavezan'
    });
  }

  if (!sessionId) {
    logger.warn('Session ID nedostaje za CSRF validaciju');
    return res.status(403).json({
      success: false,
      message: 'Neautorizovan zahtev'
    });
  }

  const storedToken = csrfTokens.get(sessionId);
  if (!storedToken || storedToken !== token) {
    logger.warn(`Nevalidan CSRF token za session: ${sessionId}`);
    return res.status(403).json({
      success: false,
      message: 'Nevalidan CSRF token'
    });
  }

  next();
};

// Endpoint za dobijanje CSRF tokena
export const getCSRFToken = (req, res) => {
  const sessionId = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
  
  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: 'Neautorizovan'
    });
  }

  const token = generateCSRFToken();
  csrfTokens.set(sessionId, token);

  // Očisti stare tokene (jednostavna implementacija)
  if (csrfTokens.size > 1000) {
    const entries = Array.from(csrfTokens.entries());
    entries.slice(0, 500).forEach(([key]) => csrfTokens.delete(key));
  }

  res.json({
    success: true,
    csrfToken: token
  });
};

// Očisti CSRF token pri logout-u
export const clearCSRFToken = (sessionId) => {
  if (sessionId) {
    csrfTokens.delete(sessionId);
  }
};