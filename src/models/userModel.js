const { PrismaClient } = require("@prisma/client");
const { findId } = require("../utils/findUserId");

const prisma = new PrismaClient();

exports.getUser = async id => {
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
  });
};