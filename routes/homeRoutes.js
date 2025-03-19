const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHome);
router.get("/jobs", homeController.getJobListing);
router.get("/jobs/details", homeController.getJobDetails);
router.post("/jobs/apply", homeController.applyForJob);

module.exports = router;
