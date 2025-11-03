import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
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
  body('type').isIn(['biznis', 'koneti']),
  body('subType').isIn(['basic', 'premium', 'vip']),
  body('subType').custom((value, { req }) => {
    if (req.body.type === 'biznis' && !['basic', 'vip'].includes(value)) {
      throw new Error('Biznis događaji mogu biti samo basic ili vip');
    }
    if (req.body.type === 'koneti' && !['basic', 'premium', 'vip'].includes(value)) {
      throw new Error('Koneti događaji mogu biti basic, premium ili vip');
    }
    return true;
  }),
  handleValidationErrors
];

export const validateId = [
  param('id').isMongoId(),
  handleValidationErrors
];