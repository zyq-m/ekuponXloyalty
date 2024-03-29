const { PrismaClient } = require("@prisma/client");
const { hash } = require("../utils/bcrypt");

const prisma = new PrismaClient();

exports.save = async (options) => {
  let b40 = options.b40;
  const config = {
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
    },
  };

  if (b40) {
    config.data.coupon = {
      create: {
        total: 0,
      },
    };

    config.data.point = {
      create: {
        total: 0,
      },
    };
  } else {
    config.data.point = {
      create: {
        total: 0,
      },
    };
  }

  return await prisma.student.create(config);
};

exports.getStudent = async (matricNo, role) => {
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

  return await prisma.student.findMany({
    where: {
      user: {
        role: {
          name: role,
        },
      },
    },
    include: {
      user: {
        select: {
          active: true,
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
};

exports.getTransaction = async (b40, matricNo) => {
  if (matricNo) {
    return await prisma.student.findUnique({
      select: {
        matricNo: true,
        transaction: {
          include: {
            cafe: {
              select: {
                name: true,
              },
            },
            walletTransaction: b40,
            pointTransaction: !b40,
          },
          take: 3,
        },
      },
      where: {
        matricNo: matricNo,
        b40: b40,
      },
    });
  }

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
        user: {
          roleId: 1,
        },
      },
    },
  });
};

// Count total of students
exports.total = async () => {
  return await prisma.student.count();
};

exports.getUserId = async (matricNo) => {
  return await prisma.student.findUnique({
    where: {
      matricNo,
    },
    select: {
      userId: true,
    },
  });
};

// Get b40 student's total wallet
exports.getWalletTotal = async (matricNo) => {
  return await prisma.student.findUnique({
    where: {
      matricNo: matricNo,
    },
    select: {
      coupon: {
        select: {
          total: true,
        },
      },
      point: {
        select: {
          total: true,
        },
      },
    },
  });
};

// Get student's total point
exports.getPointTotal = async (matricNo) => {
  return await prisma.student.findUnique({
    where: {
      b40: false,
      matricNo: matricNo,
    },
    select: {
      point: {
        select: {
          total: true,
        },
      },
    },
  });
};
