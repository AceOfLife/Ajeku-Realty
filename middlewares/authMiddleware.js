// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for secret

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Received token:', token); // Debugging log

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token.split(' ')[1], jwtSecret); // Extract token from "Bearer <token>"
      console.log('Decoded token:', decoded); // Debugging log
      req.user = decoded; // Attach the decoded token to req.user
      next(); // Proceed to the next middleware or route handler
    } catch (ex) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  },

  authorizeAdmin: (req, res, next) => {
    // Check if the authenticated user is an Admin
    if (req.user && req.user.role === 'admin') {
      next(); // Proceed to the route
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  }
};
