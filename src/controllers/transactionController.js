const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Student pays to cafe
async function createTransaction(cafeId, matricNo, amount) {
  const isEligible = await prisma.student.findUnique({
    select: {
      b40: true,
    },
    where: {
      matricNo: matricNo,
    },
  });

  if (!isEligible) {
    throw new Error("Bukan b40");
  }

  await prisma.transaction.create({
    data: {
      cafeId: cafeId,
      matricNo: matricNo,
      amount: amount,
      walletTransaction: {
        connect: {
          transactionId,
        },
      },
    },
  });
}

module.exports = { prisma, createTransaction };
