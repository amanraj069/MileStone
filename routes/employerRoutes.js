// routes/employeeRoutes.js
const express = require("express");
const employerController = require("../controllers/employerController");

const router = express.Router();

router.route("/").get(employerController.getEmployerDashboard);
router.route("/current-jobs").get(employerController.getCurrentJobs);
router.route("/milestones").get(employerController.getMilestones);
router.route("/settings").get(employerController.getSettings);

module.exports = router;
