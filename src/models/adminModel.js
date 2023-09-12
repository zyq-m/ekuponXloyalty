const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getUserId = async email => {
  return await prisma.admin.findUnique({
    where: {
      email,
    },
    select: {
      userId: true,
    },
  });
};
