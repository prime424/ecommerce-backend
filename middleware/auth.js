const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches userId to req object
 */
module.exports = function(req, res, next) {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. Invalid token format.',
      code: 'INVALID_TOKEN_FORMAT'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optional: Check if token is expired (jwt.verify already does this)
    // Additional check: ensure userId exists
    if (!decoded.userId) {
      return res.status(401).json({ 
        message: 'Invalid token payload.',
        code: 'INVALID_PAYLOAD'
      });
    }

    // Attach userId to request object for downstream routes
    req.userId = decoded.userId;
    next();
  } catch (err) {
    // Differentiate between token expired and other errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }
    // Fallback error
    res.status(401).json({ 
      message: 'Authentication failed.',
      code: 'AUTH_FAILED'
    });
  }
};