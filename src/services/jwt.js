const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.generateAccessToken = user => {
  const payload = { id: user.id, role: user.roleId };
  return (accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: "30m", // 30 minintes
  }));
};

exports.generateRefreshToken = user => {
  const payload = { id: user.id, role: user.roleId };
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "30d", // a month
  });
};

// If token valid wiil return decoded token
// Fails return error
exports.verifyAccessToken = token => {
  return jwt.verify(token, accessTokenSecret);
};

exports.verifyRefreshToken = token => {
  return jwt.verify(token, refreshTokenSecret);
};
