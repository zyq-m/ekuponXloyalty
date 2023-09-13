const { verifyAccessToken } = require("../services/jwt");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) return res.sendStatus(401);

  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
