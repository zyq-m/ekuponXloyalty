const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createCafe(cafeName) {
  await prisma.cafe.create({
    data: {
      name: cafeName,
      // user: {
      //     create: {

      //     }
      // }
    },
  });
}
