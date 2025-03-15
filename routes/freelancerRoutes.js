const express = require("express");
const freelancerController = require("./../controllers/freelancerController");

const router = express.Router();


router.route("/").get(freelancerController.getDashboard);

// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
