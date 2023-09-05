const { PrismaClient } = require("@prisma/client");
const fake = require("../src/utils/faker");
const bcrypt = require("../src/utils/bcrypt");
const prisma = new PrismaClient();

async function main() {
  const init = await initPoint();

  console.log(init);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function initStudent() {
  let b40 = fake.b40;
  return await prisma.student.create({
    data: {
      matricNo: fake.matricNo,
      icNo: fake.icNo,
      b40: b40,

      user: {
        create: {
          profile: {
            create: {
              name: fake.name,
              phoneNo: fake.phoneNo,
              address: fake.address,
            },
          },

          password: bcrypt.hash(fake.icNo),
          role: {
            connect: {
              id: b40 ? 1 : 2,
            },
          },
        },
      },

      coupon: {
        create: {
          total: 0,
        },
      },
    },
  });
}

async function initRole() {
  await prisma.role.createMany({
    data: [
      {
        id: 1,
        name: "B40",
      },
      {
        id: 2,
        name: "NON-B40",
      },
      {
        id: 3,
        name: "ADMIN",
      },
      {
        id: 4,
        name: "CAFE",
      },
    ],
  });
}

async function initCafe() {
  return await prisma.cafe.create({
    data: {
      id: fake.cafeId,
      name: fake.cafeName,
      accountNo: fake.accountNo,

      user: {
        create: {
          profile: {
            create: {
              name: fake.name,
              phoneNo: fake.phoneNo,
              address: fake.address,
            },
          },

          password: bcrypt.hash("123"),
          role: {
            connect: { id: 4 },
          },
        },
      },

      sale: {
        create: {
          total: 0,
        },
      },
    },
  });
}

async function initPoint() {
  return await prisma.point.createMany({
    data: [
      {
        name: "Point 1",
      },
      {
        name: "Point 2",
      },
      {
        name: "Point 3",
      },
    ],
  });
}
