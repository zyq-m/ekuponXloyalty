const { verifyAccessToken } = require("../../jwt");

module.exports = async (socket, next) => {
  const token = socket.handshake.auth.token;

  // If token is verified, go next
  try {
    const decode = verifyAccessToken(token);
    next();
  } catch (error) {
    console.log(error);
    next(new Error("authentication error"));
  }
};
