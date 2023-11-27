const { getTotalSales } = require("../../models/cafeModel");
const { tWalletMany } = require("../../models/transactionModel");

module.exports = (io, socket) => {
  // Get cafe's total sales & latest transaction
  socket.on("cafe:get-sales-total", async (payload) => {
    const { cafeId } = payload;

    try {
      const totalSales = await getTotalSales(cafeId);
      const latestTransactions = await tWalletMany("CAFE", cafeId, 3);
      const res = {
        total: totalSales.total,
        transaction: latestTransactions,
      };

      io.emit("cafe:get-sales-total", res);
    } catch (error) {
      io.emit("cafe:get-sales-total", { error: error });
    }
  });
};
