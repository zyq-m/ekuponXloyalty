const { getTotalSales } = require("../../models/cafeModel");
const { tWalletMany } = require("../../models/transactionModel");

module.exports = (io, socket) => {
  // Get cafe's total sales & latest transaction
  socket.on("cafe:get-sales-total", async (payload) => {
    const { cafeId, role } = payload;

    try {
      const totalSales = await getTotalSales(cafeId);
      const latestTransactions = await tWalletMany(role, cafeId, 3);
      const res = {
        total: totalSales.total,
        transaction: latestTransactions.data,
      };

      io.to(cafeId).emit("cafe:get-sales-total", res);
    } catch (error) {
      io.to(cafeId).emit("cafe:get-sales-total", { error: error });
    }
  });
};
