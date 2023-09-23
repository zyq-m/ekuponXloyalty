const {
  getLatestTransactions,
  getTotalSales,
} = require("../../models/cafeModel");

module.exports = (io, socket) => {
  // Get cafe's total sales & latest transaction
  socket.on("cafe:sales", async payload => {
    const { cafeId } = payload;

    try {
      const totalSales = await getTotalSales(cafeId);
      const latestTransactions = await getLatestTransactions(cafeId);
      const res = {
        total: totalSales.total,
        transactions: latestTransactions,
      };

      io.emit("cafe:sales-total", res);
    } catch (error) {
      io.emit("cafe:sales-total", { error: error });
    }
  });
};
