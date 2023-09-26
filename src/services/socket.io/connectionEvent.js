module.exports = (io, socket) => {
  socket.on("user:connect", payload => {
    const { id } = payload;
    socket.join(`${id}`);
  });

  socket.on("user:disconnect", payload => {
    const { id } = payload;
    socket.leave(id);
  });
};
