const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getPoint = async () => {
  return await prisma.typePoint.findMany();
};

exports.editPoint = async (id, name, value) => {
  return await prisma.typePoint.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      value: value,
    },
  });
};

exports.createPoint = async (name, value) => {
  return await prisma.typePoint.create({
    data: {
      name: name,
      value: value,
    },
  });
};
