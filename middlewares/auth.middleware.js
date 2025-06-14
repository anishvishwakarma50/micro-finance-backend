const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      // Attach user info to request object
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: 'Token verification failed', error: err.message });
  }
};

module.exports = verifyToken;
