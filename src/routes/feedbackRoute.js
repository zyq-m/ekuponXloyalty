const express = require("express");
// Require controller
const feedbackController = require("../controllers/feedbackController");
const router = express.Router();

// Handle feedback
router.get("/feedback", feedbackController.getFeedback);
router.post("/feedback", feedbackController.createFeedback);

module.exports = router;
