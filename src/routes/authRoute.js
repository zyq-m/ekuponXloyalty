const express = require("express");
// Require controller
const authController = require("../controllers/authController");
// Middleware
const { changePassword } = require("../middlewares/changePassword");

const router = express.Router();

// login
router.post("/login", authController.login);
router.post("/token", authController.updateAccessToken);
router.post("/logout", authController.logout);
router.put("/change/password", changePassword, authController.changePassword);

module.exports = router;
