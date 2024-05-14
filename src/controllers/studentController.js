const { PrismaClient } = require("@prisma/client");
const transactionModel = require("../models/transactionModel");
const { getRole } = require("../utils/role");

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
    },
  });

  if (!student) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ student });
};

// Make payment
exports.makePayment = async function (req, res) {
  const { matricNo, cafeId, amount } = req.body;
  const roleId = req.user?.roleId;

  try {
    const role = await getRole(roleId);
    // Create record in table
    const wallet = await transactionModel.createWalletTransaction(
      matricNo,
      cafeId,
      amount,
      role.name
    );

    if (!wallet) {
      return res.status(404).send({ message: "Invalid transaction" });
    }

    return res.status(201).send({ data: wallet });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

// Collect point
exports.collectPoint = async function (req, res) {
  const { matricNo, cafeId, amount, pointId, otp } = req.body;

  try {
    // Create new record
    const point = await transactionModel.createPointTransaction(
      matricNo,
      cafeId,
      amount,
      pointId
    );

    if (!point) {
      return res.status(404).json({ message: "Invalid transaction" });
    }
    // Store otp
    const userId = await prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
      select: {
        userId: true,
      },
    });
    await prisma.userToken.upsert({
      create: {
        userId: userId.userId,
        token: otp,
        mark: "otp-token",
      },
      update: {
        token: otp,
      },
      where: {
        token: otp,
        mark: "otp-token",
      },
    });

    return res.status(201).json({ data: point });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

exports.getTransaction = function (wallet) {
  return async function (req, res) {
    const { matricNo } = req.params;
    let transaction;

    if (wallet) {
      transaction = await transactionModel.tWalletMany("B40", matricNo);
    } else {
      transaction = await transactionModel.tPointMany(matricNo);
    }

    if (!transaction.data.length) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(transaction);
  };
};

// Get transaction by date
exports.getTransactionRange = function (wallet) {
  return async function (req, res) {
    const { matric, from, to } = req.params;
    let transaction;

    try {
      if (wallet) {
        transaction = await transactionModel.tWalletManyByDate(
          "B40",
          matric,
          from,
          to
        );
      } else {
        transaction = await transactionModel.tPointManyByDate(matric, from, to);
      }

      if (!transaction.data.length) {
        return res.status(404).json({ message: "Not found" });
      }

      return res.status(200).json(transaction);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
};

// Get list of cafe
exports.getCafe = async function (req, res) {
  try {
    const cafe = await prisma.cafe.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        user: {
          active: true,
        },
      },
    });

    if (!cafe.length) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ data: cafe });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
