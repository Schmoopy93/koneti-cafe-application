import { body, validationResult } from 'express-validator';
import { errorResponse } from './response.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};

export const reservationValidation = [
  body('type').isIn(['biznis', 'koneti']).withMessage('Invalid type'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').trim().isLength({ min: 8 }).withMessage('Valid phone required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time required'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1')
];

export const drinkValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('price').isNumeric().withMessage('Price must be numeric'),
  body('category').isMongoId().withMessage('Valid category ID required')
];

export const categoryValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('icon').notEmpty().withMessage('Icon is required')
];