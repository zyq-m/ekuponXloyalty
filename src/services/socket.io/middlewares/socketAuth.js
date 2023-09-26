const { verifyAccessToken } = require("../../jwt");

module.exports = async (socket, next) => {
  const header = socket.handshake.headers["authorization"];
  const token = header.split(" ")[1];

  // If token is verified, go next
  try {
    const decode = verifyAccessToken(token);
    console.log(decode);
    next();
  } catch (error) {
    console.log(error);
    next(new Error("authentication error"));
  }
};
