const studentModel = require("../../models/studentModel");
const cafeModel = require("../../models/cafeModel");
const transactionModel = require("../../models/transactionModel");

module.exports = (io, socket) => {
  // Get overall student, cafe & transaction
  io.emit("admin:get-overall", async () => {
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

      return overall;
    } catch (error) {
      return { error: error };
    }
  });
};
