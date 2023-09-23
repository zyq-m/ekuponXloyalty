const { getWalletTotal, getTransaction } = require("../../models/studentModel");

module.exports = (io, socket) => {
  // Get b40 student's wallet amount & transaction
  socket.on("student:wallet", async payload => {
    const { matricNo } = payload;

    try {
      const walletTotal = await getWalletTotal(matricNo);
      const latestTransactions = await getTransaction(true);
      const res = {
        total: walletTotal.coupon,
        transaction: latestTransactions,
      };

      io.emit("student:wallet-total", res);
    } catch (error) {
      io.emit("student:wallet-total", { error: error });
    }
  });

  // Get student's point
  // socket.on("student:");
};

// Better kita buat payment guna direct api tanpa guna socket
