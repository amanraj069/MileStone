const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Handle POST requests for login and signup
router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);

// Handle logout
router.get("/logout", authController.getLogout);

module.exports = router;
