const { PrismaClient } = require("@prisma/client");
const { verify } = require("../utils/otp");

// Student can scan one-time QR (token)
// Student (ios) can input OTP
exports.verifyPoint = async (req, res, next) => {
  const { cafeId, otp } = req.body;

  // Token or OTP must be provided
  if (!otp) {
    return res.status(400).send({ message: "Please provide credential" });
  }

  // Verify OTP if exists
  const prisma = new PrismaClient();
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
    return res.status(400).json({ message: "Credential expired" });
  }

  // Check if otp has been used
  const prevOtp = await prisma.userToken.findUnique({
    where: {
      token: otp,
      mark: "otp-token",
    },
  });

  if (prevOtp) {
    return res.status(400).send({ message: "Credential has been used" });
  }

  next();
};
