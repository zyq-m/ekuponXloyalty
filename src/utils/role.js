const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// find role by user id
exports.getRole = async (id) => {
  return await prisma.role.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });
};
