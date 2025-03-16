const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.getHome);

module.exports = router;
