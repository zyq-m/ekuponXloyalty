const { PrismaClient } = require("@prisma/client");
const { findId } = require("../utils/findUserId");

const prisma = new PrismaClient();

exports.save = async (id, description) => {
  const userId = await findId(id);

  return await prisma.feedback.create({
    data: {
      userId: userId.value.userId,
      description: description,
    },
  });
};

exports.getAll = async () => {
  return await prisma.feedback.findMany();
};
