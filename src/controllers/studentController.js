const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { verify } = require("../utils/otp");

const prisma = new PrismaClient();

// Get students
exports.getStudent = async function (req, res) {
  const { matricNo } = req.params;
  const student = await prisma.student.findUnique({
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

  if (!student) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: student });
};

// Create new students
exports.newStudent = async function (req, res) {
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
exports.updateCoupon = async function (req, res) {
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
exports.makePayment = async function (req, res) {
  const { matricNo, cafeId, amount } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      matricNo: matricNo,
      cafeId: cafeId,
      amount: amount,
    },
  });

  try {
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

    if (!pay) {
      return res.status(404).send({ message: "Invalid transaction" });
    }

    // Update coupon balance
    await prisma.coupon.update({
      data: {
        total: transaction.student.coupon[0].total - amount,
      },
      where: {
        matricNo: matricNo,
      },
    });

    return res.status(201).send({ data: pay });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

// Collect point
// Student can scan one-time QR (token)
// Student (ios) can input OTP
exports.collectPoint = async function (req, res) {
  const { matricNo, cafeId, amount, token, otp, pointId } = req.body;

  // Token or OTP must be provided
  if ((!token || otp) && (token || !otp)) {
    return res.status(400).send({ message: "Please provide credential" });
  }

  // Verify token (one-time-URL) if exists
  if (token) {
    jwt.verify(token, process.env.OTP_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).send({ message: "URL expired" });
      }
    });
  }

  // Verify OTP if exists
  if (otp) {
    if (!verify(otp)) {
      return res.status(400).send({ message: "OTP expired" });
    }
  }

  try {
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
        pointId: pointId,
      },
    });

    if (!point) {
      return res.status(404).json({ message: "Invalid transaction" });
    }

    return res.status(201).json({ data: point });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

exports.getTransaction = async function (req, res) {
  const { matricNo, b40 } = req.params;

  const transaction = await prisma.transaction.findMany({
    where: {
      matricNo: matricNo,
    },
    include: {
      walletTransaction: b40,
      pointTransaction: !b40,
    },
  });

  if (!transaction.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
};

// Get transaction by date
exports.getTransactionRange = async (req, res) => {
  const { matricNo, from, to } = req.params;
  const transaction = await prisma.transaction.findMany({
    where: {
      matricNo: matricNo,
      createdAt: {
        lte: from,
        gte: to,
      },
    },
  });

  if (!transaction.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
};
