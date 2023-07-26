const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization'); // Assuming you pass the JWT token in the 'Authorization' header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = verifyToken;
