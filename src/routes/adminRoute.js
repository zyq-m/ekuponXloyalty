const express = require("express");

// Require controllers
const adminController = require("../controllers/adminController");

const router = express.Router();

// Get all students
router.get("/student", adminController.getStudent);
// Get all cafe
router.get("/cafe", adminController.getCafe);

// Get cafe & student transactions
// router.get("/student/transactions", adminController.getWalletTransaction);
router.get(
  "/student/transactions/:matricNo",
  adminController.getWalletTransaction
);
router.get("/cafe/transactions/:cafeId", adminController.getTransactionCafe);
// Get student points (non-b40)
router.get("/student/points/:matricNo", adminController.getPointTransaction);

// Verify cafe's claims
router.post("/cafe/claim", adminController.claimTransaction);

// Suspend a user
router.put("/user/suspend", adminController.suspendUser);

// Assign student's wallet (b40)
router.put("/student/wallet", adminController.updateWallet);

// Register user
router.post("/user/register/student", adminController.registerStudent);
router.post("/user/register/cafe", adminController.registerCafe);
router.post("/user/register/admin");

// Transaction
router.get("/report/transaction", adminController.getReport(false, true));
router.get("/report/transaction/:from/:to", adminController.getReport(false));
router.get(
  "/report/transaction/pdf/:from/:to",
  adminController.getReport(true)
);

module.exports = router;
