const archiver = require("archiver");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const studentModel = require("../models/studentModel");
const cafeModel = require("../models/cafeModel");
const transactionModel = require("../models/transactionModel");
const { createQR } = require("../utils/qrGenerator");
const { generateUrl } = require("../utils/generateURL");

const prisma = new PrismaClient();

exports.registerStudent = async (req, res) => {
  try {
    const student = await studentModel.save(req.body);

    return res.status(201).send({ data: student });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.registerCafe = async (req, res) => {
  try {
    const cafe = await cafeModel.save(req.body);

    return res.status(201).send({ data: cafe });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getStudent = (role) => {
  return async (req, res) => {
    let student;

    try {
      if (role === "B40") {
        student = await studentModel.getStudent(null, "B40");
      }
      if (role === "PAYNET") {
        student = await studentModel.getStudent(null, "PAYNET");
      }
      if (role === "MAIDAM") {
        student = await studentModel.getStudent(null, "MAIDAM");
      }

      if (!student?.length) {
        return res.status(404).send({ message: "Not found" });
      }

      return res.status(200).send({ data: student });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };
};

exports.getCafe = async (req, res) => {
  const cafe = await cafeModel.getCafe();

  if (!cafe.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: cafe });
};

exports.getPointTransaction = async (req, res) => {
  const { matricNo } = req.params;
  const data = await transactionModel.tPointMany(matricNo, undefined);

  if (!data.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: data });
};

exports.getWalletTransaction = async (req, res) => {
  const { matricNo } = req.params;
  try {
    const data = await transactionModel.tWalletMany("B40", matricNo, undefined);

    if (!data.data.length) {
      return res.status(404).send({ message: "Not found" });
    }

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getTransactionCafe = async (req, res) => {
  const { cafeId } = req.params;
  const data = await transactionModel.tWalletMany("CAFE", cafeId, undefined);

  if (!data.data.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send(data);
};

exports.updateWallet = async (req, res) => {
  const { matricNo, amount } = req.body;

  try {
    const coupon = await studentModel.updateCoupon(matricNo, amount);

    return res.status(200).send({ data: coupon });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }
};

exports.getTransactionByDate = async (req, res) => {
  const { cafeId, from, to } = req.params;
  const transaction = await transactionModel.tWalletManyByDate(
    "CAFE",
    cafeId,
    from,
    to
  );

  if (!transaction.data.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send(transaction);
};

exports.suspendUser = async (req, res) => {
  const { id, active } = req.body;
  // Find user id
  try {
    const user = await prisma.user.update({
      data: {
        active,
      },
      where: {
        id,
      },
      select: {
        id: true,
        active: true,
      },
    });

    return res.status(200).send({ data: user, message: "success" });
  } catch (error) {
    return res.status(404).send({ error: "User not found" });
  }
};

exports.getReport = (pdf, all) => async (req, res) => {
  const { from, to } = req.params;
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  try {
    let report;

    if (all) {
      report = await overallCafeTransaction({ all });
    } else {
      report = await overallCafeTransaction({ from, to });
    }

    if (!report.length) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    if (pdf) {
      res.header("Content-Security-Policy", "img-src 'self'");
      res.render("admin/transaction", {
        transaction: report,
        date: { from, to },
      });
    } else {
      res.status(200).send({ transaction: report, date: { from, to } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

exports.claimTransaction = async (req, res) => {
  const { cafeId, email, from, to } = req.body;

  try {
    // update total (sale table)
    const transactionReport = await overallCafeTransaction({ from, to });

    if (!transactionReport.length) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    transactionReport.forEach(async (tf) => {
      const sale = await cafeModel.getTotalSales(tf.id);

      await prisma.sale.update({
        where: {
          cafeId: tf.id,
        },
        data: {
          total: +sale.total - +tf.totalAmount,
        },
      });
      // create new record in table sale history
      await prisma.saleHistory.create({
        data: {
          cafeId: tf.id,
          total: tf.totalAmount,
        },
      });
    });

    // set claimed = t
    const updateClaim = await prisma.claim.updateMany({
      data: {
        claimed: true,
        markedBy: email,
        claimedAt: new Date(),
      },
      where: {
        transactionType: "wallet",
        transaction: {
          createdAt: {
            lte: new Date(to),
            gte: new Date(from),
          },
        },
      },
    });

    if (updateClaim.count <= 0) {
      return res.status(200).send({ message: "No transaction updated" });
    }

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const overallCafeTransaction = async ({ from, to, all }) => {
  if (all) {
    return await prisma.$queryRaw`
    select c.id, p.name, c.name "cafeName", c."accountNo", c.bank, count(t.id) "totalTransaction", sum(tw.amount) "totalAmount" 
    from "TWallet" tw 
    inner join "Transaction" t on t.id = tw."transactionId" 
    inner join "Claim" cm on tw."transactionId" = cm."transactionId" 
    inner join "Cafe" c on c.id = t."cafeId" 
    inner join "Profile" p on p."userId" = c."userId" 
    where cm.claimed = false
    group by c.name, c.id, p.name`;
  }
  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  // set date early 1 day
  dateFrom.setDate(dateFrom.getDate() - 1);
  // set date late 1 day
  dateTo.setDate(dateTo.getDate() + 1);

  return await prisma.$queryRaw`
    select c.id, p.name, c.name "cafeName", c."accountNo", c.bank, count(t.id) "totalTransaction", sum(tw.amount) "totalAmount" 
    from "TWallet" tw 
    inner join "Transaction" t on t.id = tw."transactionId" 
    inner join "Claim" cm on tw."transactionId" = cm."transactionId" 
    inner join "Cafe" c on c.id = t."cafeId" 
    inner join "Profile" p on p."userId" = c."userId" 
    where cm.claimed = false
    and t."createdAt" >= ${dateFrom} and t."createdAt" < ${dateTo}
    group by c.name, c.id, p.name`;
};

exports.generateQR = async (req, res) => {
  try {
    const cafes = await cafeModel.getCafe();
    cafes.forEach((cafe) => {
      createQR(generateUrl(cafe.id), cafe.name);
    });

    const archive = archiver("zip");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=CafeQR.zip");

    archive.pipe(res);
    archive.directory(path.join("uploads/qr"), false);
    archive.finalize();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
