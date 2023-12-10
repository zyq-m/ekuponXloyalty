const { PrismaClient } = require("@prisma/client");
const { findId } = require("../utils/findUserId");
const { hash, check } = require("../utils/bcrypt");

const prisma = new PrismaClient();

exports.getUser = async (id) => {
  // findId(id) will return
  // { status: 'fulfilled', value: { userId: 'bla bla' }
  const isExist = await findId(id);

  if (!isExist) {
    return false;
  }

  return await prisma.user.findUnique({
    where: {
      id: isExist.value.userId,
    },
    include: {
      role: {
        select: {
          name: true,
        },
      },
    },
  });
};

exports.updatePassword = async (id, password) => {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: hash(password),
    },
  });
};
