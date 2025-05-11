const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET , REFRESH_TOKEN_SECRET } = require('../config/env');

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
