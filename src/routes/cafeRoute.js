const express = require("express");

// Require controllers
const {
  getCafe,
  getTransactionPdf,
  getTransactionRange,
  getTransaction,
  getEkuponURL,
  getOTP,
} = require("../controllers/cafeController");

const router = express.Router();

router.get("/:cafeId", getCafe);

// Get cafe QR
router.get("/qr/ekupon/:cafeId", getEkuponURL);
router.get("/qr/loyalty/:cafeId", getOTP(true));
// Get one-time code
router.get("/one-time/:cafeId", getOTP(false));

// Transaction
router.get("/transaction/:cafeId", getTransaction);
router.get("/transaction/:from/:to/:cafeId", getTransactionRange);
// Response with pdf
router.get("/transaction/pdf/:from/:to/:cafeId", getTransactionPdf);

module.exports = router;
