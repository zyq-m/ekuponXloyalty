const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getLimit = async (roleId) => {
  return prisma.limitSpend.findUnique({
    where: {
      roleId: roleId,
    },
  });
};

exports.getAllLimit = async () => {
  return prisma.limitSpend.findMany({
    include: {
      role: true,
    },
  });
};

exports.updateLimit = async (limit, roleId) => {
  return prisma.limitSpend.update({
    data: {
      limit: limit,
    },
    where: {
      roleId: roleId,
    },
  });
};
