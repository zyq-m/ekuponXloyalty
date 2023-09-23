const {
  getWalletTotal,
  getTransaction,
  getPointTotal,
} = require("../../models/studentModel");

module.exports = (io, socket) => {
  // Get b40 student's wallet amount & transaction
  socket.on("student:wallet", async payload => {
    const { matricNo } = payload;

    try {
      const walletTotal = await getWalletTotal(matricNo);
      const latestTransactions = await getTransaction(true);

      if (!walletTotal) {
        return io.emit("student:wallet-res", { message: "Not found" });
      }

      const res = {
        coupon: `RM ${walletTotal.coupon}`,
        point: walletTotal.point,
        transaction: latestTransactions,
      };

      io.emit("student:wallet-total", res);
    } catch (error) {
      io.emit("student:wallet-total", { error: error });
    }
  });

  // Get student's point
  socket.on("student:point", async payload => {
    const { matricNo } = payload;

    try {
      const pointTotal = await getPointTotal(matricNo);
      const latestTransactions = await getTransaction(false);

      if (!pointTotal) {
        return io.emit("student:point-total", { message: "Not found" });
      }

      const res = {
        point: pointTotal.point,
        transaction: latestTransactions,
      };

      io.emit("student:point-total", res);
    } catch (error) {
      io.emit("student:point-total", { error: error });
    }
  });
};

// Better kita buat payment guna direct api tanpa guna socket