const { PrismaClient } = require("@prisma/client");
const { findId } = require("../utils/findUserId");

const prisma = new PrismaClient();

exports.getUser = async id => {
  const isExits = await findId(id);

  if (!isExits) {
    return false;
  }

  return await prisma.user.findUnique({
    where: {
      id: isExits,
    },
  });
};

exports.storeRefreshToken = async (refreshToken, userId) => {
  // Store refresh token
  await prisma.userToken.create({
    data: {
      token: refreshToken,
      userId: userId,
    },
  });
};
