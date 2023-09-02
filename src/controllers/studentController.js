const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get students
exports.getStudent = async function (req, res, next) {
  const { matricNo } = req.params;
  const { b40 } = req.body;

  if (matricNo) {
    const student = await prisma.student.findUnique({
      where: {
        matricNo: matricNo,
      },

      select: {
        matricNo: true,
        icNo: true,
        user: {
          select: {
            role: true,
          },
        },

        coupon: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ data: student });
  }

  if (b40 == undefined && !matricNo) {
    // Find all students
    const students = await prisma.student.findMany();

    return res.status(200).json({ data: students });
  }

  // Find either b40 or not
  const students = await prisma.student.findMany({
    where: {
      b40: b40,
    },
  });

  return res.status(200).json({ data: students });
};

// Create new students
exports.newStudent = async function (req, res, next) {
  const { matricNo, icNo, b40, name, phoneNo, address } = req.body;

  try {
    const student = await prisma.student.create({
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

            password: icNo,
            role: {
              connect: {
                id: b40 ? 2 : 1,
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

    return res.status(201).json({ data: student });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Update coupon (b40 only)
exports.updateCoupon = async function (req, res, next) {
  const { matricNo, amount } = req.body;

  try {
    // Get previous coupon information
    const prevCoupon = await prisma.coupon.findUnique({
      where: {
        matricNo: matricNo,
      },
      select: {
        total: true,
      },
    });

    // Update coupon amount
    const student = await prisma.coupon.update({
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

    // Store previous coupon
    await prisma.couponHistory.create({
      data: {
        matricNo: matricNo,
        total: prevCoupon.total,
      },
    });

    return res.status(200).json({ data: student });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

// Make payment
exports.makePayment = async function (req, res, next) {
  const { matricNo, cafeId, amount } = req.body;
  const transaction = await makeTransaction(matricNo, cafeId, amount);
  // Create record in table
  const pay = await prisma.tWallet.create({
    data: {
      transactionId: transaction.id,
    },
    select: {
      transaction: {
        select: {
          cafe: true,
          cafeId: true,
          matricNo: true,
          student: {
            select: {
              user: {
                select: {
                  profile: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Update coupon balance
  await prisma.coupon.update({
    data: {
      total: transaction.student.coupon[0].total - amount,
    },
    where: {
      matricNo: matricNo,
    },
  });

  if (!pay) {
    return res.status(404).send({ message: "Invalid transaction" });
  }

  return res.status(201).send({ data: pay });
};

// Collect point
exports.collectPoint = async function (req, res, next) {
  const { matricNo, cafeId, amount } = req.body;

  // Create new record
  const transaction = await prisma.transaction.create({
    data: {
      cafeId: cafeId,
      matricNo: matricNo,
      amount: amount,
    },
  });

  // Create new record
  const point = await prisma.tPoint.create({
    data: {
      transactionId: transaction.id,
    },
  });

  if (!point) {
    return res.status(404).json({ message: "Invalid transaction" });
  }

  return res.status(201).json({ data: point });
};

// HELPERS

// This function return transaction information
async function makeTransaction(matricNo, cafeId, amount) {
  return await prisma.transaction.create({
    data: {
      matricNo: matricNo,
      cafeId: cafeId,
      amount: amount,
    },
  });
}
