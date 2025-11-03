import crypto from 'crypto';

const csrfTokens = new Map();

export const generateCSRFToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  csrfTokens.set(token, timestamp);
  
  // Cleanup old tokens (older than 1 hour)
  for (const [key, time] of csrfTokens.entries()) {
    if (timestamp - time > 3600000) {
      csrfTokens.delete(key);
    }
  }
  
  return token;
};

export const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') return next();
  
  const token = req.headers['x-csrf-token'] || (req.body && req.body._csrf);
  
  if (!token || !csrfTokens.has(token)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid CSRF token' 
    });
  }
  
  csrfTokens.delete(token);
  next();
};

export const getCSRFToken = (req, res) => {
  const token = generateCSRFToken();
  res.json({ csrfToken: token });
};