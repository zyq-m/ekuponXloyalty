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
router.get("/cafe", defineRole(["B40", "NON-B40"]), getCafe);
router.get("/:matricNo", defineRole(["B40", "NON-B40"]), getStudent);

router.get(
  "/transaction/wallet/:matricNo",
  defineRole(["B40", "NON-B40"]),
  getTransaction(true)
);
router.get(
  "/transaction/point/:matricNo",
  defineRole(["B40", "NON-B40"]),
  getTransaction(false)
);

router.get(
  "/transaction/wallet/:from/:to/:matricNo",
  defineRole(["B40", "NON-B40"]),
  getTransactionRange(true)
);
router.get(
  "/transaction/point/:from/:to/:matricNo",
  defineRole(["B40", "NON-B40"]),
  getTransactionRange(false)
);

// Pay
// Students only can spend RM6 per day (b40-only)
router.post("/pay", defineRole(["B40"]), checkBalance, makePayment);
// Collect point
router.post(
  "/point/collect",
  defineRole(["B40", "NON-B40"]),
  verifyPoint,
  collectPoint
);

module.exports = router;
