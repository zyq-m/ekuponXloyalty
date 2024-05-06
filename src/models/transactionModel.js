const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Count total of transaction made
exports.totalCoupon = async () => {
  return await prisma.tWallet.count();
};

// Count total of point made
exports.totalPoint = async () => {
  return await prisma.tPoint.count();
};

exports.createWalletTransaction = async (
  matricNo,
  cafeId,
  amount,
  fundType
) => {
  const transaction = await prisma.transaction.create({
    data: {
      matricNo: matricNo,
      cafeId: cafeId,
    },
  });

  const pay = await prisma.tWallet.create({
    data: {
      transactionId: transaction.id,
      amount: amount,
      fundType: fundType,
    },
  });
  await prisma.claim.create({
    data: {
      transactionId: transaction.id,
      transactionType: "wallet",
    },
  });

  // Update coupon balance
  const prevCouponBalance = await prisma.coupon.findUnique({
    where: { matricNo: matricNo },
    select: { total: true },
  });
  await prisma.coupon.update({
    data: {
      total: +prevCouponBalance.total - +amount,
    },
    where: {
      matricNo: matricNo,
    },
  });

  // Update cafe's sale
  const prevSale = await prisma.sale.findUnique({
    where: { cafeId: cafeId },
    select: { total: true },
  });
  await prisma.sale.update({
    data: {
      total: +prevSale.total + +amount,
    },
    where: {
      cafeId: cafeId,
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
    },
  });
  // Create new record
  const point = await prisma.tPoint.create({
    data: {
      transactionId: transaction.id,
      pointId: +pointId,
      amount: +amount,
    },
  });
  await prisma.claim.create({
    data: {
      transactionId: transaction.id,
      transactionType: "point",
    },
  });

  // Update point balance
  // Need to be refactor
  const prevCouponBalance = await prisma.point.findUnique({
    where: { matricNo: matricNo },
    select: { total: true },
  });
  await prisma.point.update({
    where: {
      matricNo: matricNo,
    },
    data: {
      total: +prevCouponBalance.total + +amount,
    },
  });

  return point;
};

exports.tWalletMany = async (role, id, take) => {
  const config =
    role === "B40" || role === "MAIDAM"
      ? {
          matricNo: id,
          claim: {
            claimed: false,
          },
        }
      : {
          cafeId: id,
          claim: {
            claimed: false,
          },
        };

  const summary = await prisma.tWallet.aggregate({
    where: {
      transaction: config,
    },
    _sum: {
      amount: true,
    },
  });

  const transactions = await prisma.tWallet.findMany({
    where: {
      transaction: config,
    },
    include: {
      transaction: {
        include: {
          cafe: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    take: take,
    orderBy: {
      transaction: {
        createdOn: "desc",
      },
    },
  });

  return { data: transactions, summary: summary };
};

exports.tWalletManyByDate = async (role, id, from, to) => {
  const config =
    role === "B40" || role === "MAIDAM"
      ? {
          matricNo: id,
          claim: {
            claimed: false,
          },
          createdAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }
      : {
          cafeId: id,
          claim: {
            claimed: false,
          },
          createdAt: {
            gte: new Date(from),
            lte: new Date(to),
          },
        };

  const summary = await prisma.tWallet.aggregate({
    where: {
      transaction: config,
    },
    _sum: {
      amount: true,
    },
  });

  const transactions = await prisma.tWallet.findMany({
    where: {
      transaction: config,
    },
    include: {
      transaction: {
        include: {
          cafe: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      transaction: {
        createdOn: "desc",
      },
    },
  });

  return { data: transactions, summary: summary };
};

exports.tPointMany = async (id, take) => {
  const summary = await prisma.tPoint.aggregate({
    where: {
      transaction: {
        matricNo: id,
        claim: {
          claimed: false,
        },
      },
    },
    _sum: {
      amount: true,
    },
  });

  const transactions = await prisma.tPoint.findMany({
    where: {
      transaction: {
        matricNo: id,
        claim: {
          claimed: false,
        },
      },
    },
    include: {
      transaction: {
        include: {
          cafe: {
            select: {
              name: true,
            },
          },
          pointTransaction: {
            select: {
              point: {
                select: {
                  value: true,
                },
              },
            },
          },
        },
      },
    },
    take: take,
    orderBy: {
      transaction: {
        createdAt: "desc",
      },
    },
  });

  return { data: transactions, summary: summary };
};

exports.tPointManyByDate = async (id, from, to) => {
  const summary = await prisma.tPoint.aggregate({
    where: {
      transaction: {
        matricNo: id,
        claim: {
          claimed: false,
        },
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    },
    _sum: {
      amount: true,
    },
  });

  const transactions = await prisma.tPoint.findMany({
    where: {
      transaction: {
        matricNo: id,
        claim: {
          claimed: false,
        },
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    },
    include: {
      transaction: {
        include: {
          cafe: {
            select: {
              name: true,
            },
          },
          pointTransaction: {
            select: {
              point: {
                select: {
                  value: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      transaction: {
        createdAt: "desc",
      },
    },
  });

  return { data: transactions, summary: summary };
};
