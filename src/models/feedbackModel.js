const { PrismaClient } = require("@prisma/client");
const studentModel = require("./studentModel");
const cafeModel = require("./cafeModel");

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

exports.getAll = async () => {
  return await prisma.feedback.findMany();
};

// HELPER
const findId = async id => {
  const student = studentModel.getUserId(id);
  const cafe = cafeModel.getUserId(id);

  const userId = await Promise.allSettled([student, cafe]);

  if (!userId[0] && !userId[1]) {
    return undefined;
  }

  if (userId[0]) {
    return userId[0];
  }
  return userId[1];
};
