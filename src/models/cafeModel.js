const { PrismaClient } = require("@prisma/client");
const { hash } = require("../utils/bcrypt");
const { generateSecret } = require("../utils/otp");

const prisma = new PrismaClient();

exports.save = async options => {
  const secret = generateSecret();
  return await prisma.cafe.create({
    data: {
      id: options.cafeId,
      name: options.cafeName,
      accountNo: options.accountNo,

      user: {
        create: {
          profile: {
            create: {
              name: options.name,
              phoneNo: options.phoneNo,
              address: options.address,
            },
          },

          password: hash(options.password),
          role: {
            connect: { id: 4 },
          },
        },
      },

      sale: {
        create: {
          total: 0,
          otp: secret,
        },
      },
    },
  });
};

exports.getCafe = async cafeId => {
  if (cafeId) {
    return await prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
      select: {
        id: true,
        name: true,
        sale: {
          select: {
            total: true,
          },
        },
        user: {
          select: {
            profile: true,
          },
        },
      },
    });
  }

  return await prisma.cafe.findMany({
    include: {
      user: {
        select: {
          active: true,
        },
      },
    },
  });
};

// Count total of cafe
exports.total = async () => {
  return await prisma.cafe.count();
};

exports.getUserId = async id => {
  return await prisma.cafe.findUnique({
    where: { id },
    select: { userId: true },
  });
};

exports.getTotalSales = async cafeId => {
  return await prisma.sale.findUnique({
    where: {
      cafeId,
    },
    select: {
      total: true,
    },
  });
};

exports.getLatestTransactions = async cafeId => {
  return await prisma.tWallet.findMany({
    where: {
      transaction: {
        cafeId,
      },
    },
    orderBy: {
      transaction: {
        createdAt: "desc",
      },
    },
    take: 3,
  });
};
