const express = require("express");

// Require controllers
const {
  getCafe,
  getTransactionPdf,
  getTransactionRange,
  getTransaction,
} = require("../controllers/cafeController");

const router = express.Router();

router.get("/:cafeId", getCafe);

// Get cafe QR
router.get("/qr/ekupon/:cafeId");
router.get("/qr/loyalty/:cafeId");
// Get one-time code
router.get("/one-time/:cafeId");

// Transaction
router.get("/transaction/:cafeId", getTransaction);
router.get("/transaction/:from/:to/:cafeId", getTransactionRange);
// Response with pdf
router.get("/transaction/pdf/:from/:to/:cafeId", getTransactionPdf);
