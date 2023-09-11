const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Count total of transaction made
exports.totalCoupon = async () => {
  return await prisma.coupon.count();
};

// Count total of point made
exports.totalPoint = async () => {
  return await prisma.tPoint.count();
};
