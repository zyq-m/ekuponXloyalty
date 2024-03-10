const express = require("express");
const limitController = require("../controllers/limitSpendController");

const router = express.Router();

router.get("/", limitController.getLimitSpend);
router.put("/", limitController.updateLimitSpend);

module.exports = router;
