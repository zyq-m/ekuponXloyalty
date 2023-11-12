const studentModel = require("../../models/studentModel");
const cafeModel = require("../../models/cafeModel");
const transactionModel = require("../../models/transactionModel");

module.exports = (io, socket) => {
  io.on("admin:get-overall", async () => {
    // Get overall student, cafe & transaction
    const student = studentModel.total();
    const cafe = cafeModel.total();
    const coupon = transactionModel.totalCoupon();
    const point = transactionModel.totalPoint();
    const arrReq = [student, cafe, coupon, point];

    try {
      const data = await Promise.all(arrReq);
      const overall = {
        student: data[0],
        cafe: data[1],
        coupon: data[2],
        point: data[3],
      };

      io.emit("admin:get-overall", overall);
    } catch (error) {
      io.emit("admin:get-overall", { error: error });
    }
  });
};
