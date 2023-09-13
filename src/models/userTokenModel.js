const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.storeRefreshToken = async (refreshToken, userId) => {
  // Store refresh token
  await prisma.userToken.create({
    data: {
      token: refreshToken,
      userId: userId,
    },
  });
};

exports.removeRefreshToken = async refreshToken => {
  return await prisma.userToken.delete({
    where: {
      token: refreshToken,
    },
  });
};
