import { body, param, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Sanitizacija input-a
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key].trim());
      }
    });
  }
  next();
};

// Validacija rezultata
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Neispravni podaci',
      errors: errors.array()
    });
  }
  next();
};

// Admin validacije
export const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Lozinka mora imati najmanje 6 karaktera'),
  handleValidationErrors
];

export const validateAdminCreate = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/)
    .withMessage('Ime može sadržavati samo slova'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Lozinka mora imati 8+ karaktera, velika/mala slova, broj i specijalni karakter'),
  handleValidationErrors
];

// Rezervacija validacije
export const validateReservation = [
  body('type')
    .isIn(['business', 'experience'])
    .withMessage('Tip događaja mora biti business ili experience'),
  body('subType')
    .isIn(['business_basic', 'business_high', 'experience_start', 'experience_classic', 'experience_celebration'])
    .withMessage('Podtip mora biti business_basic, business_high, experience_start, experience_classic ili experience_celebration'),
  body('name')
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/)
    .withMessage('Ime može sadržavati samo slova'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Neispravna email adresa'),
  body('phone')
    .matches(/^[\+]?[0-9\s\-\(\)]{8,15}$/)
    .withMessage('Neispravan broj telefona'),
  body('date')
    .isISO8601()
    .toDate()
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value < today) {
        throw new Error('Datum ne može biti u prošlosti');
      }
      return true;
    }),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Neispravan format vremena'),
  body('guests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Broj gostiju mora biti između 1 i 20'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Poruka ne može biti duža od 500 karaktera'),
  handleValidationErrors
];

// ID validacija
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Neispravan ID format'),
  handleValidationErrors
];

// Drink validacije
export const validateDrink = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Naziv mora imati 2-100 karaktera'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Cena mora biti pozitivan broj'),
  body('category')
    .isMongoId()
    .withMessage('Neispravna kategorija'),
  handleValidationErrors
];

// Category validacije
export const validateCategory = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Naziv kategorije mora imati 2-50 karaktera'),
  handleValidationErrors
];