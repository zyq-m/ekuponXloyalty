const { PrismaClient } = require("@prisma/client");
const { hash } = require("../utils/bcrypt");

const prisma = new PrismaClient();

exports.save = async options => {
  let b40 = options.b40;

  return await prisma.student.create({
    data: {
      matricNo: options.matricNo,
      icNo: options.icNo,
      b40: b40,

      user: {
        create: {
          profile: {
            create: {
              name: options.name,
              phoneNo: options.phoneNo,
              address: options.address,
            },
          },

          password: hash(options.icNo),
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
};

exports.getStudent = async matricNo => {
  if (matricNo) {
    return await prisma.student.findUnique({
      where: {
        matricNo: matricNo,
      },
      select: {
        matricNo: true,
        icNo: true,
        user: {
          select: {
            profile: true,
          },
        },
        coupon: {
          select: {
            total: true,
          },
        },
      },
    });
  }

  return await prisma.student.findMany();
};

exports.getTransaction = async b40 => {
  return await prisma.student.findMany({
    select: {
      icNo: true,
      matricNo: true,
      transaction: true,
    },
    where: {
      b40: b40,
    },
  });
};

// Update coupon (b40 only)
exports.updateCoupon = async (matricNo, amount) => {
  // TODO: Make this query can update more than one record
  // Get previous coupon information
  const prevCoupon = await prisma.coupon.findUnique({
    where: {
      matricNo: matricNo,
    },
    select: {
      total: true,
    },
  });

  // Store previous coupon
  await prisma.couponHistory.create({
    data: {
      matricNo: matricNo,
      total: prevCoupon.total,
    },
  });

  // Update coupon amount
  return await prisma.coupon.update({
    data: {
      total: amount,
    },
    where: {
      matricNo: matricNo,
      student: {
        b40: true,
      },
    },
  });
};

// Count total of students
exports.total = async () => {
  return await prisma.student.count();
};
