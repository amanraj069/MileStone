// routes/homeRoutes.js
const express = require("express");
const homeController = require("./../controllers/homeController");

const router = express.Router();

// Routes
router.route("/").get(homeController.getHome);
router.route("/vanya").get(homeController.getVanya);
router.route("/jobs").get(homeController.getJobListing);
router.route("/jobs/details").get(homeController.getJobDetails);

module.exports = router;
