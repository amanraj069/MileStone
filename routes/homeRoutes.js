const express = require("express");
const homeController = require("./../controllers/homeController");

const router = express.Router();


router.route("/").get(homeController.getHome);

// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
