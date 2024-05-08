const express = require("express");

// Require controllers
const {
  getStudent,
  getTransaction,
  getTransactionRange,
  makePayment,
  collectPoint,
  getCafe,
} = require("../controllers/studentController");

// Require middleware
const { checkBalance } = require("../middlewares/checkBalance");
const { verifyPoint } = require("../middlewares/collectPoint");
const { defineRole } = require("../middlewares/role");

const router = express.Router();

// Get student by matric no
router.get("/cafe", defineRole(["B40", "MAIDAM", "PAYNET"]), getCafe);
router.get("/:matricNo", defineRole(["B40", "MAIDAM", "PAYNET"]), getStudent);

router.get(
  "/transaction/wallet/:matricNo",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  getTransaction(true)
);
router.get(
  "/transaction/point/:matricNo",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  getTransaction(false)
);

router.get(
  "/transaction/wallet/:from/:to/:matricNo",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  getTransactionRange(true)
);
router.get(
  "/transaction/point/:from/:to/:matricNo",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  getTransactionRange(false)
);

// Pay
// Students only can spend RM6 per day (b40-only)
router.post(
  "/pay",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  checkBalance,
  makePayment
);
// Collect point
router.post(
  "/point/collect",
  defineRole(["B40", "MAIDAM", "PAYNET"]),
  verifyPoint,
  collectPoint
);

module.exports = router;
