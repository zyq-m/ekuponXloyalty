const { PrismaClient } = require("@prisma/client");
const fake = require("../src/utils/faker");
const bcrypt = require("../src/utils/bcrypt");
const cafeModel = require("../src/models/cafeModel");
const prisma = new PrismaClient();

async function main() {
  const init = await initPoint();

  console.log(init);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function initStudent() {
  let b40 = fake.b40;
  const config = {
    data: {
      matricNo: fake.matricNo,
      icNo: fake.icNo,

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
    },
  };

  if (b40) {
    (config.data.coupon = {
      create: {
        total: 0,
      },
    }),
      (config.data.point = {
        create: {
          total: 0,
        },
      });
  } else {
    config.data.point = {
      create: {
        total: 0,
      },
    };
  }

  return await prisma.student.create(config);
}

async function initRole() {
  await prisma.role.createMany({
    data: [
      {
        name: "B40",
      },
      {
        name: "PAYNET",
      },
      {
        name: "ADMIN",
      },
      {
        name: "CAFE",
      },
      {
        name: "MAIDAM",
      },
    ],
  });
}

async function initCafe() {
  return await cafeModel.save({
    cafeId: fake.cafeId,
    cafeName: fake.cafeName,
    accountNo: fake.accountNo,
    name: fake.name,
    phoneNo: fake.phoneNo,
    address: fake.address,
    password: "123",
  });
}

async function initPoint() {
  return await prisma.typePoint.createMany({
    data: [
      {
        name: "Cashless",
        value: 1,
      },
      {
        name: "Green Campus",
        value: 1,
      },
    ],
  });
}

async function initAdmin() {
  return await prisma.user.create({
    data: {
      admin: {
        create: {
          email: "admin123@gmail.com",
        },
      },
      password: bcrypt.hash("admin123"),
      roleId: 3,
    },
  });
}
