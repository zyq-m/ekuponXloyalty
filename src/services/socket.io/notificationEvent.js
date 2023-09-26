module.exports = (io, socket) => {
  socket.on("notification:send", payload => {
    const { receiver, message } = payload;
    // Reciever could be cafe
    io.to(`${receiver}`).emit("notification:receiver", message);
  });
};
