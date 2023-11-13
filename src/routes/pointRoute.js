const express = require("express");
// Require controller
const pointController = require("../controllers/pointController");
const router = express.Router();

router.get("/", pointController.getPoint);
router.post("/", pointController.createPoint);
router.put("/", pointController.editPoint);

module.exports = router;
