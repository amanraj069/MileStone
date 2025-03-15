// routes/adminRoutes.js
const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route("/").get(adminController.getAdminDashboard);

module.exports = router;
