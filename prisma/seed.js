const { PrismaClient } = require("@prisma/client");
const fake = require("../src/utils/faker");
const bcrypt = require("../src/utils/bcrypt");
const cafeModel = require("../src/models/cafeModel");
const prisma = new PrismaClient();

async function main() {
  const init = await prisma.student.findMany({
    include: {
      user: true,
      coupon: true,
    },
  });

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
        id: 1,
        name: "B40",
      },
      {
        id: 2,
        name: "PAYNET",
      },
      {
        id: 3,
        name: "ADMIN",
      },
      {
        id: 4,
        name: "CAFE",
      },
      {
        id: 5,
        name: "MAIDAM",
      },
      {
        id: 6,
        name: "TILAWAH",
      },
    ],
    skipDuplicates: true,
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

async function addManyStudent(dt) {
  const user_arr = dt.map((d) => ({
    password: bcrypt.hash(d.ic_no),
    roleId: 6,
  }));
  const users = await prisma.user.createManyAndReturn({
    data: user_arr,
    skipDuplicates: true,
  });

  const student_arr = dt.map((d, i) => ({
    icNo: d.ic_no,
    matricNo: d.matric_no,
    userId: users[i].id,
  }));
  const student = await prisma.student.createManyAndReturn({
    data: student_arr,
    skipDuplicates: true,
  });

  const profile_arr = dt.map((d, i) => ({ userId: users[i].id, name: d.name }));
  const profile = await prisma.profile.createManyAndReturn({
    data: profile_arr,
    skipDuplicates: true,
  });

  const coupon_arr = dt.map((d) => ({ matricNo: d.matric_no, total: 119 }));
  const coupon = await prisma.coupon.createManyAndReturn({
    data: coupon_arr,
    skipDuplicates: true,
  });

  return { users, student, profile, coupon };
}
