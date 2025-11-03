import { logger } from '../utils/logger.js';

export const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Logiraj bezbednosno relevantne zahteve
  const securityPaths = ['/api/admin', '/api/reservations'];
  const isSecurityRelevant = securityPaths.some(path => req.path.startsWith(path));
  
  if (isSecurityRelevant) {
    logger.info('Security request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }

  // Logiraj sumnjive aktivnosti
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS pokušaji
    /union.*select/i,  // SQL injection
    /javascript:/i  // JavaScript protokol
  ];

  const requestData = JSON.stringify(req.body) + req.url + (req.get('User-Agent') || '');
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestData));

  if (isSuspicious) {
    logger.warn('Suspicious activity detected', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }

  // Logiraj response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (isSecurityRelevant || res.statusCode >= 400) {
      logger.info('Security response', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
    }

    // Logiraj neuspešne pokušaje autentifikacije
    if (req.path.includes('/login') && res.statusCode === 401) {
      logger.warn('Failed login attempt', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
    }
  });

  next();
};