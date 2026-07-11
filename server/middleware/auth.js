const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = auth;
