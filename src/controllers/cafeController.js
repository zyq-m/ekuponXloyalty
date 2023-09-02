const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getCafe = async function getCafe(req, res, next) {
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
    },
  });

  if (!cafe) {
    return res.status(404).json({ message: "Cafe not found" });
  }

  return res.status(200).json({ data: cafe });
};

exports.getTransaction = async (req, res, next) => {
  const { cafeId } = req.params;
  const transaction = await prisma.transaction.findMany({
    where: {
      cafeId: cafeId,
    },
  });

  if (!transaction) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
};

exports.getTransactionRange = async (req, res, next) => {
  const { cafeId, from, to } = req.params;
  const transaction = await transactionOnDate(cafeId, from, to);

  if (!transaction) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ data: transaction });
};

exports.getTransactionPdf = async (req, res, next) => {
  const { cafeId, from, to } = req.params;
  const transaction = await transactionOnDate(cafeId, from, to);

  if (!transaction) {
    return res.status(404).json({ message: "Not found" });
  }

  // Return PDF format
  return res.status(200).json({ data: transaction });
};

exports.getEkuponURL = async (req, res, next) => {
  const { cafeId } = req.params;
  const id = await getCafeId(cafeId);

  if (!id) {
    return res.status(404).json({ message: "Not Found" });
  }

  const url = generateUrl(cafeId);
  return res.status(200).json({
    data: {
      url: url,
    },
  });
};

exports.getLoyaltyURL = async (req, res, next) => {
  const { cafeId } = req.params;
  const id = await getCafeId(cafeId);

  if (!id) {
    return res.status(404).json({ message: "Not Found" });
  }

  const url = generateUrl(cafeId);
  return res.status(200).json({
    data: {
      url: url,
    },
  });
};

// HELPER
// Get transaction by date
async function transactionOnDate(cafeId, from, to) {
  return await prisma.transaction.findMany({
    where: {
      cafeId: cafeId,
      createdAt: {
        lte: from,
        gte: to,
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
    },
  });
}

// Generate url
function generateUrl(cafeId) {
  // generate code here

  return cafeId;
}
