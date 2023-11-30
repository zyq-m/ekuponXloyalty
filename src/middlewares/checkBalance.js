const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.checkBalance = async (req, res, next) => {
  const { matricNo, amount } = req.body;

  const date = new Date();
  date.setDate(date.getDate() + 1);

  const transactionToday = await prisma.tWallet.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      transaction: {
        matricNo: matricNo,
        createdAt: {
          equals: date,
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

  console.log(totalSpendToday, spend, date);

  if (spend <= 6) {
    next();
  } else {
    // When spend exceeds 6, reject requests
    res.status(406).send({ message: "You have reach the limit of spend" });
  }
};
