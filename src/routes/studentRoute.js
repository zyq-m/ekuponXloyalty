const express = require("express");

// Require models
const {
  getStudent,
  newStudent,
  updateCoupon,
  makePayment,
  collectPoint,
} = require("../controllers/studentController");

const router = express.Router();
// Student routes

router.get("/", getStudent);
router.post("/", newStudent);

// Get student by matric no
router.get("/:matricNo", getStudent);
//
router.put("/coupon/update", updateCoupon);

// Pay
router.post("/pay", makePayment);
// Collect point
router.post("/point/collet", collectPoint);

module.exports = router;
