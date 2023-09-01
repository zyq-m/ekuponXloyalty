const { PrismaClient } = require("@prisma/client");
const fake = require("../src/utils/faker");
const bcrypt = require("../src/utils/bcrypt");
const prisma = new PrismaClient();

async function main() {
  let matricNo = fake.matricNo;
  let icNo = fake.icNo;
  let b40 = fake.b40;
  let name = fake.name;
  let phone = fake.phoneNo;
  let address = fake.address;

  const student = await initStudent(matricNo, icNo, b40, name, phone, address);

  console.log(student);
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

async function initStudent(matricNo, icNo, b40, name, phoneNo, address) {
  return await prisma.student.create({
    data: {
      matricNo: matricNo,
      icNo: icNo,
      b40: b40,

      user: {
        create: {
          profile: {
            create: {
              name: name,
              phoneNo: phoneNo,
              address: address,
            },
          },

          password: bcrypt.hash(icNo),
          role: {
            connect: {
              id: b40 ? 1 : 2,
            },
          },
        },
      },

      coupon: {
        create: {
          amount: 0,
        },
      },
    },
    include: {
      coupon: true,
      user: true,
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
    ],
  });
}
