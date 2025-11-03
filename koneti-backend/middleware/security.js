import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: {
    success: false,
    message: 'Previše zahteva, pokušajte ponovo kasnije.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Previše zahteva, pokušajte ponovo kasnije.'
    });
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Previše pokušaja prijave, pokušajte ponovo kasnije.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Previše pokušaja prijave, pokušajte ponovo kasnije.'
    });
  }
});

export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Previše admin operacija, sačekajte.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Previše admin operacija, sačekajte.'
    });
  }
});

export const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  message: {
    success: false,
    message: 'Previše pokušaja rezervacije, pokušajte ponovo kasnije.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Previše pokušaja rezervacije, pokušajte ponovo kasnije.'
    });
  }
});