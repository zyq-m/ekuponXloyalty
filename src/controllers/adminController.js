const { PrismaClient } = require("@prisma/client");
const studentModel = require("../models/studentModel");
const cafeModel = require("../models/cafeModel");

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

exports.getStudent = async (req, res) => {
  const student = await studentModel.getStudent();

  if (!student.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: student });
};

exports.getCafe = async (req, res) => {
  const cafe = await cafeModel.getCafe();

  if (!cafe.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: cafe });
};

exports.getTransactionStudent = async (req, res) => {
  const data = await studentModel.getTransaction();

  if (!data.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: data });
};

exports.getTransactionStudentB40 = async (req, res) => {
  const { b40 } = req.body;

  try {
    const data = await studentModel.getTransaction(b40);

    if (!data.length) {
      return res.status(404).send({ message: "Not found" });
    }

    return res.status(200).send({ data: data });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getTransactionCafe = async (req, res) => {
  const data = await prisma.cafe.findMany({
    select: {
      id: true,
      name: true,
      transaction: true,
    },
  });

  if (!data.length) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.status(200).send({ data: data });
};

exports.updateWallet = async (req, res) => {
  const { matricNo, amount } = req.body;

  try {
    const coupon = await studentModel.updateCoupon(matricNo, amount);

    return res.status(200).send({ data: coupon });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
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

exports.getReport = (pdf) => async (req, res) => {
  const { from, to } = req.params;
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const dateFrom = new Date(from);
  const dateTo = new Date(to);

  // set date early 1 day
  dateFrom.setDate(dateFrom.getDate() - 1);
  // set date late 1 day
  dateTo.setDate(dateTo.getDate() + 1);

  try {
    const report = await prisma.$queryRaw`
      select c.id, p.name, c.name "cafeName", p.address, p."phoneNo", c."accountNo", count(c.id) "totalTransaction", sum(t.amount) amount
      from "TWallet" w
      inner join "Transaction" t on w."transactionId" = t.id
      inner join "Claim" cm on w."transactionId" = t.id
      inner join "Cafe" c on c.id = t."cafeId"
      inner join "Profile" p on p."userId" = c."userId"
      where t."createdAt" >= ${dateFrom}
      and t."createdAt" < ${dateTo}
      and cm.claimed = false
      group by c.id, p.address, p."phoneNo", p.name`;

    if (!report.length) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    if (pdf) {
      res.header("Content-Security-Policy", "img-src 'self'");
      res.render("admin/transaction", { transaction: report });
    } else {
      res.status(200).send(report);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};
