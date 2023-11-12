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

const router = express.Router();

// Get student by matric no
router.get("/cafe", getCafe);
router.get("/:matricNo", getStudent);

router.get("/transaction/wallet/:matricNo", getTransaction(true));
router.get("/transaction/point/:matricNo", getTransaction(false));

router.get(
  "/transaction/wallet/:from/:to/:matricNo",
  getTransactionRange(true)
);
router.get(
  "/transaction/point/:from/:to/:matricNo",
  getTransactionRange(false)
);

// Pay
// Students only can spend RM6 per day (b40-only)
router.post("/pay", checkBalance, makePayment);
// Collect point
router.post("/point/collect", verifyPoint, collectPoint);

module.exports = router;
