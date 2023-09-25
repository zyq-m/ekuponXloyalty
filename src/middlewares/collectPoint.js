const { verifyPoint } = require("../services/jwt");
const { verify } = require("../utils/otp");

// Student can scan one-time QR (token)
// Student (ios) can input OTP
exports.verifyPoint = async (req, res, next) => {
  const { cafeId, token, otp } = req.body;

  // Token or OTP must be provided
  if ((!token || otp) && (token || !otp)) {
    return res.status(400).send({ message: "Please provide credential" });
  }

  // Verify token (one-time-URL) if exists
  if (token) {
    try {
      verifyPoint(token);
      next();
    } catch (error) {
      console.log(error);
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

    next();
  }
};
