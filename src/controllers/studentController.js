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

// Make payment
// ! NEED REFACTOR
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
// ! NEED REFACTOR
exports.collectPoint = async function (req, res) {
  const { matricNo, cafeId, amount, token, otp, pointId } = req.body;

  // Token or OTP must be provided
  if ((!token || otp) && (token || !otp)) {
    return res.status(400).send({ message: "Please provide credential" });
  }

  // Verify token (one-time-URL) if exists
  if (token) {
    try {
      jwt.verify(token, process.env.OTP_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "URL expired", error: error });
    }
  }

  // Verify OTP if exists
  if (otp) {
    const secret = await prisma.sale.findUnique({
      select: {
        otp: true,
      },
      where: {
        cafeId: cafeId,
      },
    });

    const isVerified = verify(otp, secret.otp);

    if (!isVerified) {
      return res.status(400).json({ message: "OTP expired" });
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

    // Update coupon total
    await prisma.coupon.update({
      data: {
        total: 0,
      },
    });

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
