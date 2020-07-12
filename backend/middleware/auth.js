const jwt = require('jsonwebtoken');
const config = require ('../config/auth.config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId == !userId) {
      return 'UserId non valable';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Requete non authentifiée!')
    });
  }
};

