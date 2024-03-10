const { getWalletTotal, getPointTotal } = require("../../models/studentModel");
const { tWalletMany, tPointMany } = require("../../models/transactionModel");

module.exports = (io, socket) => {
  // Get b40 student's wallet amount & transaction
  socket.on("student:get-wallet-total", async (payload) => {
    const { matricNo, role } = payload;

    try {
      const [walletTotal, latestTransactions] = await Promise.allSettled([
        getWalletTotal(matricNo),
        tWalletMany(role, matricNo, 3),
      ]);

      if (!walletTotal) {
        return io
          .to(matricNo)
          .emit("student:wallet-res", { message: "Not found" });
      }

      const res = {
        coupon: walletTotal.value.coupon,
        transaction: latestTransactions.value.data,
      };

      io.to(matricNo).emit("student:get-wallet-total", res);
    } catch (error) {
      console.error(error);
      io.to(matricNo).emit("student:get-wallet-total", { error: error });
    }
  });

  // Get student's point (NON-B40)
  socket.on("student:get-point-total", async (payload) => {
    const { matricNo } = payload;

    try {
      const pointTotal = await getPointTotal(matricNo);
      const latestTransactions = await tPointMany(matricNo, 3);

      if (!pointTotal) {
        return io
          .to(matricNo)
          .emit("student:point-total", { message: "Not found" });
      }

      const res = {
        point: pointTotal.point,
        transaction: latestTransactions,
      };

      io.to(matricNo).emit("student:get-point-total", res);
    } catch (error) {
      io.to(matricNo).emit("student:get-point-total", { error: error });
    }
  });
};

// Better kita buat payment guna direct api tanpa guna socket
