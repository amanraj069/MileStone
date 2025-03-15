// routes/employeeRoutes.js
const express = require("express");
const employerController = require("../controllers/employerController");

const router = express.Router();

router.route("/").get(employerController.getEmployerDashboard);

module.exports = router;
