const express = require("express");
// Require controller
const pointController = require("../controllers/pointController");
const router = express.Router();
const { defineRole } = require("../middlewares/role");

router.get("/", pointController.getPoint);
router.post("/", defineRole(["ADMIN"]), pointController.createPoint);
router.put("/", defineRole(["ADMIN"]), pointController.editPoint);

module.exports = router;
