const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const oneTimeUrlSecret = process.env.OTP_SECRET;

exports.generateAccessToken = (user) => {
  const payload = { id: user.id, roleId: user.roleId };
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: "30m", // 30 minintes
  });
};

exports.generateRefreshToken = (user) => {
  const payload = { id: user.id, roleId: user.roleId };
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "30d", // a month
  });
};

// If token valid wiil return decoded token
// Fails return error
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret);
};

// Verify token (one-time-URL)
exports.verifyPoint = (token) => {
  return jwt.verify(token, oneTimeUrlSecret);
};
