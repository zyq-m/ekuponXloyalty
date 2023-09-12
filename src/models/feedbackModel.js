const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.save = async (id, description) => {
  const userId = await findId(id);

  return await prisma.feedback.create({
    data: {
      userId: userId,
      description: description,
    },
  });
};
