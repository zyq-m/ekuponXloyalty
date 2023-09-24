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

exports.createWalletTransaction = async (matricNo, cafeId, amount) => {
  const transaction = await prisma.transaction.create({
    data: {
      matricNo: matricNo,
      cafeId: cafeId,
      amount: amount,
    },
  });

  const pay = await prisma.tWallet.create({
    data: {
      transactionId: transaction.id,
    },
  });

  // Update coupon balance
  const prevCouponBalance = await prisma.coupon.findUnique({
    where: { matricNo: matricNo },
    select: { total: true },
  });
  await prisma.coupon.update({
    data: {
      total: prevCouponBalance.total - amount,
    },
    where: {
      matricNo: matricNo,
    },
  });

  return pay;
};

exports.createPointTransaction = async (matricNo, cafeId, amount, pointId) => {
  // Create new record
  const transaction = await prisma.transaction.create({
    data: {
      cafeId: cafeId,
      matricNo: matricNo,
      amount: amount,
    },
  });
  // Create new record
  const point = await prisma.tPoint.create({
    data: {
      transactionId: transaction.id,
      pointId: pointId,
    },
  });

  // Update coupon balance
  const prevCouponBalance = await prisma.point.findUnique({
    where: { matricNo: matricNo },
    select: { total: true },
  });
  await prisma.point.update({
    data: {
      total: prevCouponBalance.total + amount,
    },
    where: {
      matricNo: matricNo,
    },
  });

  return point;
};
