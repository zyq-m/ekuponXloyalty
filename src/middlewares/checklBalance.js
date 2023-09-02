const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.checkBalance = async (req, res, next) => {
  const { matricNo, amount } = req.body;

  const transactionToday = await prisma.transaction.aggregate({
    _sum: {
      matricNo: true,
    },
    where: {
      matricNo: matricNo,
      createdAt: {
        lte: new Date(), // less than or equal
        gte: new Date(), // greater than org equal
      },
      //   createdAt: {
      //     equals: new Date(),
      //   },
    },
  });

  const spend = transactionToday._sum.amount + amount;

  if (spend <= 6) {
    next();
  }

  // When spend exceeds 6, reject requests
  return res.status(406).json({ message: "You have reach the limit of spend" });
};
