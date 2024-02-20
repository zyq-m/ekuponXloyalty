const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getLimit = async (roleId) => {
  return prisma.limitSpend.findUnique({
    where: {
      roleId: roleId,
    },
  });
};
