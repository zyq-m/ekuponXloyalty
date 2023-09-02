const express = require("express");

// Require controllers
const {
  getStudent,
  newStudent,
  updateCoupon,
  makePayment,
  collectPoint,
} = require("../controllers/studentController");
// Require middleware
const { checkBalance } = require("../middlewares/checkBalance");

const router = express.Router();
// Student routes

router.get("/", getStudent);
router.post("/", newStudent);

// Get student by matric no
router.get("/:matricNo", getStudent);
//
router.put("/coupon/update", updateCoupon);

// Pay
// Students only can spend RM6 per day
router.post("/pay", checkBalance, makePayment);
// Collect point
router.post("/point/collet", collectPoint);

module.exports = router;
