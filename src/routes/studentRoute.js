const express = require("express");

// Require controllers
const {
  getStudent,
  getTransaction,
  getTransactionRange,
  makePayment,
  collectPoint,
} = require("../controllers/studentController");

// Require middleware
const { checkBalance } = require("../middlewares/checkBalance");

const router = express.Router();

// Get student by matric no
router.get("/:matricNo", getStudent);

router.get("/transaction/:matricNo", getTransaction);
router.get("/transaction/:from/:to/:matricNo", getTransactionRange);

// Pay
// Students only can spend RM6 per day
router.post("/pay", checkBalance, makePayment);
// Collect point
router.post("/point/collet", collectPoint);

module.exports = router;
