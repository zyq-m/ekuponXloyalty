const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const { generatePDF } = require("../utils/pdf/pdf");
const { generateToken, verify } = require("../utils/otp");

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
  const transaction = await prisma.transaction.findMany({
    where: {
      cafeId: cafeId,
    },
    include: {
      walletTransaction: true,
      cafe: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!transaction.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
};

exports.getTransactionRange = async (req, res) => {
  const { cafeId, from, to } = req.params;
  const transaction = await transactionOnDate(cafeId, from, to);

  if (!transaction.length) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
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
      url: url,
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
      const loyaltyUrl = `${generateUrl(cafeId)}&&otp=${token}`;
      return res.status(201).json({
        data: {
          url: loyaltyUrl,
          name: id.name,
        },
      });
    }

    return res.status(200).json({ data: { otp: token } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

// HELPER
// Get transaction by date
async function transactionOnDate(cafeId, from, to) {
  return await prisma.transaction.findMany({
    where: {
      cafeId: cafeId,
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
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

// Generate url
function generateUrl(cafeId) {
  // generate code here
  const hostname =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_BASE_URL
      : process.env.LOCAL_BASE_URL;

  return `${hostname}?id=${cafeId}`;
}
