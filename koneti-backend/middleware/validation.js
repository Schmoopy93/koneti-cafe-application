import { body, param, validationResult } from 'express-validator';
import { logger } from '../utils/logger.js';

export const handleValidationErrors = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log validation errors without exposing sensitive data
      logger.warn('Validation failed', { 
        path: req.path, 
        method: req.method,
        errorCount: errors.array().length 
      });
      
      return res.status(400).json({
        success: false,
        message: 'Neispravni podaci',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  } catch (error) {
    logger.error('Error in validation middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Greška pri validaciji podataka'
    });
  }
};

export const validateAdmin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  handleValidationErrors
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

export const validateReservation = [
  body('name').isLength({ min: 2, max: 50 }).matches(/^[a-zA-ZšđčćžŠĐČĆŽ\s]+$/),
  body('email').isEmail().normalizeEmail(),
  body('phone').matches(/^[\+]?[0-9\s\-\(\)]{8,15}$/),
  body('date').isISO8601().toDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('guests').isInt({ min: 1, max: 20 }),
  body('type').isIn(['business', 'experience']),
  body('subType').isIn(['business_basic', 'business_high', 'experience_start', 'experience_classic', 'experience_celebration']),
  body('subType').custom((value, { req }) => {
    try {
      const allowedBusinessTypes = ['business_basic', 'business_high'];
      const allowedExperienceTypes = ['experience_start', 'experience_classic', 'experience_celebration'];
      
      if (req.body.type === 'business' && !allowedBusinessTypes.includes(value)) {
        throw new Error('Business događaji mogu biti samo business_basic ili business_high');
      }
      if (req.body.type === 'experience' && !allowedExperienceTypes.includes(value)) {
        throw new Error('Experience događaji mogu biti experience_start, experience_classic ili experience_celebration');
      }
      return true;
    } catch (error) {
      throw error;
    }
  }),
  handleValidationErrors
];

export const validateId = [
  param('id').isMongoId(),
  handleValidationErrors
];