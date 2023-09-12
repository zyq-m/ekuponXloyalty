const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.ACCESS_TOKEN_SECRET;

exports.generateToken = user => {
  const payload = { id: user.id, role: user.roleId };
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: "30m", // 30 minintes
  });

  const refreshToken = jwt.sign(payload, refreshTokenSecret, {
    expiresIn: "30d", // a month
  });

  return { accessToken, refreshToken };
};

// If token valid wiil return decoded token
// Fails return error
exports.verifyToken = token => {
  return jwt.verify(token, accessTokenSecret);
};
