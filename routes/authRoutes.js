// routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/login")
  .get(authController.getLogin)
  .post(authController.postLogin);

router.route("/signup")
  .get(authController.getSignup)
  .post(authController.postSignup);

router.route("/logout")
  .get(authController.getLogout);

module.exports = router;