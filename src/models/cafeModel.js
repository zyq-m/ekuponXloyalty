const { PrismaClient } = require("@prisma/client");
const { hash } = require("../utils/bcrypt");

const prisma = new PrismaClient();

exports.save = async options => {
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

  return await prisma.cafe.findMany();
};