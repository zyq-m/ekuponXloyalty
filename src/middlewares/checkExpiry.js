const { PrismaClient } = require("@prisma/client");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const prisma = new PrismaClient();

exports.checkExpiry = async (req, res, next) => {
  const { matricNo } = req.body;

  try {
    const student = await prisma.coupon.findUnique({
      where: {
        matricNo: matricNo,
      },
    });

    if (dayjs().isSame(student.expiry)) {
      return res.status(406).send({
        message: `Your coupon has expired ${dayjs(student.expiry).fromNow()}`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
};
