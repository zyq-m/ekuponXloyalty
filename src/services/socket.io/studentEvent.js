const {
  getWalletTotal,
  getTransaction,
  getPointTotal,
} = require("../../models/studentModel");

module.exports = (io, socket) => {
  // Get b40 student's wallet amount & transaction
  socket.on("student:get-wallet-total", async (payload) => {
    const { matricNo } = payload;

    try {
      const walletTotal = await getWalletTotal(matricNo);
      const latestTransactions = await getTransaction(true, matricNo);

      if (!walletTotal) {
        return io.emit("student:wallet-res", { message: "Not found" });
      }

      const res = {
        coupon: walletTotal.coupon,
        point: walletTotal.point,
        transaction: latestTransactions,
      };

      io.emit("student:get-wallet-total", res);
    } catch (error) {
      io.emit("student:get-wallet-total", { error: error });
    }
  });

  // Get student's point (NON-B40)
  socket.on("student:get-point-total", async (payload) => {
    const { matricNo } = payload;

    try {
      const pointTotal = await getPointTotal(matricNo);
      const latestTransactions = await getTransaction(false, matricNo);

      if (!pointTotal) {
        return io.emit("student:point-total", { message: "Not found" });
      }

      const res = {
        point: pointTotal.point,
        transaction: latestTransactions,
      };

      io.emit("student:get-point-total", res);
    } catch (error) {
      io.emit("student:get-point-total", { error: error });
    }
  });
};

// Better kita buat payment guna direct api tanpa guna socket
