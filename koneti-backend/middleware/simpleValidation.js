export const validateReservation = (req, res, next) => {
  const { type, name, email, phone, date, time, guests } = req.body;
  const errors = [];

  if (!type || !['biznis', 'koneti'].includes(type)) {
    errors.push('Valid type required (biznis or koneti)');
  }
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email required');
  }
  
  if (!phone || phone.trim().length < 8) {
    errors.push('Valid phone required');
  }
  
  if (!date) {
    errors.push('Date required');
  }
  
  if (!time || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    errors.push('Valid time required (HH:MM format)');
  }
  
  if (!guests || guests < 1) {
    errors.push('At least 1 guest required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
  }

  next();
};