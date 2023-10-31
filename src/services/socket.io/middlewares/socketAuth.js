const { verifyAccessToken } = require("../../jwt");

module.exports = async (socket, next) => {
  const header = socket.handshake.auth.token;

  // If token is verified, go next
  try {
    const token = header.split(" ")[1];
    const decode = verifyAccessToken(token);
    console.log(decode);
    next();
  } catch (error) {
    console.log(error);
    next(new Error("authentication error"));
  }
};
