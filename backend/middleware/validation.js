const { body } = require('express-validator');

exports.validateMeetingInput = [
  body('email').isEmail().normalizeEmail(),
  body('meeting_date').isDate({ format: 'YYYY-MM-DD' }),
  body('meeting_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('meeting_mode').isIn(['video', 'phone']),
  body('timezone').optional().isString(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];