// routes/freelancerRoutes.js
const express = require("express");
const freelancerController = require("../controllers/freelancerController");

const router = express.Router();

router.route("/").get(freelancerController.getFreelancerDashboard);

module.exports = router;
