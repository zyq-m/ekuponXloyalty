const {
  getLatestTransactions,
  getTotalSales,
} = require("../../models/cafeModel");

module.exports = (io, socket) => {
  // Get cafe's total sales & latest transaction
  socket.on("cafe:get-sales-total", async payload => {
    const { cafeId } = payload;

    try {
      const totalSales = await getTotalSales(cafeId);
      const latestTransactions = await getLatestTransactions(cafeId);
      const res = {
        total: totalSales.total,
        transactions: latestTransactions,
      };

      io.emit("cafe:get-sales-total", res);
    } catch (error) {
      io.emit("cafe:get-sales-total", { error: error });
    }
  });
};
