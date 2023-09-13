const express = require("express");
// Require controller
const authController = require("../controllers/authController");

const router = express.Router();

// login
router.post("/login", authController.login);
router.post("/token", authController.updateAccessToken);
router.delete("/logout", authController.logout);

module.exports = router;
