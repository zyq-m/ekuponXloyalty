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
const { checkExpiry } = require("../middlewares/checkExpiry");

const router = express.Router();
const authenticatedRoles = ["B40", "MAIDAM", "PAYNET", "TILAWAH"];

// Get student by matric no
router.get("/cafe", defineRole(authenticatedRoles), getCafe);
router.get("/:matricNo", defineRole(authenticatedRoles), getStudent);

router.get(
  "/transaction/wallet/:matricNo",
  defineRole(authenticatedRoles),
  getTransaction(true)
);
router.get(
  "/transaction/point/:matricNo",
  defineRole(authenticatedRoles),
  getTransaction(false)
);

router.get(
  "/transaction/wallet/:from/:to/:matricNo",
  defineRole(authenticatedRoles),
  getTransactionRange(true)
);
router.get(
  "/transaction/point/:from/:to/:matricNo",
  defineRole(authenticatedRoles),
  getTransactionRange(false)
);

// Pay
// Students only can spend RM6 per day (b40-only)
router.post(
  "/pay",
  defineRole(authenticatedRoles),
  checkExpiry,
  checkBalance,
  makePayment
);
// Collect point
router.post(
  "/point/collect",
  defineRole(authenticatedRoles),
  verifyPoint,
  collectPoint
);

module.exports = router;
