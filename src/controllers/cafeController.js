const { PrismaClient } = require("@prisma/client");
const { generatePDF } = require("../utils/pdf/pdf");
const { generateToken } = require("../utils/otp");
const {
  tWalletMany,
  tWalletManyByDate,
} = require("../models/transactionModel");
const { generateUrl } = require("../utils/generateURL");

const prisma = new PrismaClient();

exports.getCafe = async function getCafe(req, res) {
  const { cafeId } = req.params;
  const cafe = await prisma.cafe.findUnique({
    where: {
      id: cafeId,
    },
    select: {
      id: true,
      name: true,
      sale: {
        select: {
          total: true,
        },
      },
      user: {
        select: {
          profile: true,
        },
      },
    },
  });

  if (!cafe) {
    return res.status(404).json({ message: "Cafe not found" });
  }

  return res.status(200).json({ data: cafe });
};

exports.getTransaction = async (req, res) => {
  const { cafeId } = req.params;
  const transaction = await tWalletMany("CAFE", cafeId);

  if (!transaction.data.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(transaction);
};

exports.getTransactionRange = async (req, res) => {
  const { cafeId, from, to } = req.params;
  const transaction = await tWalletManyByDate("CAFE", cafeId, from, to);

  if (!transaction.data.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(transaction);
};

exports.getTransactionPdf = async (req, res) => {
  const { cafeId, from, to } = req.params;
  try {
    const transaction = await transactionOnDate(cafeId, from, to);

    if (!transaction.length) {
      return res.status(404).json({ message: "Not found" });
    }

    const pdf = await generatePDF(transaction, "");
    // Return PDF format
    return res.status(200).sendFile(pdf?.filename, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=example.pdf", // use inline to view file, use attachment to download
      },
    });
  } catch (error) {
    return res.status(error.statusCode).send({ error: error.message });
  }
};

exports.getEkuponURL = async (req, res) => {
  const { cafeId } = req.params;
  const id = await getCafeId(cafeId);

  if (!id) {
    return res.status(404).json({ message: "Not Found" });
  }

  const url = generateUrl(cafeId);

  return res.status(201).json({
    data: {
      url: `${url}&name=${id.name}`,
      name: id.name,
    },
  });
};

exports.getOTP = (url) => async (req, res) => {
  const { cafeId } = req.params;
  const id = await getCafeId(cafeId);

  if (!id.id) {
    return res.status(404).json({ message: "Not found" });
  }

  // Generate 6 digit number
  // Hash otp
  try {
    const token = generateToken(id.sale.otp);

    if (url) {
      const loyaltyUrl = `${generateUrl(cafeId)}&otp=${token}&name=${id.name}`;
      return res.status(201).json({
        data: {
          url: loyaltyUrl,
          name: id.name,
        },
      });
    }

    return res.status(200).json({
      data: {
        otp: token,
        remaining: 30 - Math.floor((new Date().getTime() / 1000.0) % 30),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

exports.profile = (update) => async (req, res) => {
  const { cafeId } = req.params;

  try {
    const profile = await prisma.cafe.findUnique({
      where: {
        id: cafeId,
      },
      select: {
        accountNo: true,
        bank: true,
      },
    });

    if (!profile) {
      return res.status(404).send({ message: "Not found" });
    }

    if (update) {
      const { bankName, accountNo } = req.body;

      const updated = await prisma.cafe.update({
        data: {
          accountNo: accountNo,
          bank: bankName,
        },
        where: {
          id: cafeId,
        },
        select: {
          accountNo: true,
          bank: true,
        },
      });

      return res.status(201).send(updated);
    }

    return res.status(200).send(profile);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// HELPER
// Get transaction by date
async function transactionOnDate(cafeId, from, to) {
  return await prisma.tWallet.findMany({
    where: {
      transaction: {
        cafeId: cafeId,
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
        claim: {
          claimed: false,
        },
      },
    },
    include: {
      transaction: {
        include: {
          cafe: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      transaction: {
        createdOn: "desc",
      },
    },
  });
}

// Get cafe id
async function getCafeId(cafeId) {
  return await prisma.cafe.findUnique({
    where: {
      id: cafeId,
    },
    select: {
      id: true,
      name: true,
      sale: {
        select: {
          otp: true,
        },
      },
    },
  });
}
