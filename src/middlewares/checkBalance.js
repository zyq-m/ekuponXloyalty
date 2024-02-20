const { PrismaClient } = require("@prisma/client");
const { getLimit } = require("../models/limitSpendModel");

const prisma = new PrismaClient();

exports.checkBalance = async (req, res, next) => {
  const { matricNo, amount } = req.body;

  const date = new Date();
  const now = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const transactionToday = await prisma.tWallet.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      transaction: {
        matricNo: matricNo,
        createdAt: {
          equals: now,
        },
      },
    },
  });

  const coupon = await prisma.coupon.findUnique({
    select: {
      total: true,
    },
    where: {
      matricNo: matricNo,
    },
  });

  if (coupon.total < 2) {
    return res.status(406).send({ message: "Insufficient amount" });
  }

  const total = transactionToday._sum.amount;
  const totalSpendToday = !total ? 0 : +total;
  const spend = totalSpendToday + +amount;
  const roleId = req.user?.roleId;
  const spendLimit = await getLimit(roleId);

  console.log({
    total,
    date,
    now,
  });

  if (spend <= spendLimit.limit) {
    next();
  } else {
    // When spend exceeds spend limit, reject requests
    res.status(406).send({ message: "You have reach the limit of spend" });
  }
};
