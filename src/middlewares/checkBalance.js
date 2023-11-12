const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.checkBalance = async (req, res, next) => {
  const { matricNo, amount } = req.body;

  const transactionToday = await prisma.transaction.aggregate({
    _sum: {
      amount: true,
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
  const total = transactionToday._sum.amount;
  const totalSpendToday = !total ? 0 : total;
  const spend = parseInt(totalSpendToday) + parseInt(amount);

  if (spend <= 6) {
    next();
  } else {
    // When spend exceeds 6, reject requests
    return res
      .status(406)
      .json({ message: "You have reach the limit of spend" });
  }
};
