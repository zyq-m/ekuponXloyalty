const express = require("express");
// Require controller
const feedbackController = require("../controllers/feedbackController");
const router = express.Router();

// Handle feedback
router.get("/", feedbackController.getFeedback);
router.post("/", feedbackController.createFeedback);

module.exports = router;
