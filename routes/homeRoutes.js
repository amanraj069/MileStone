const express = require("express");
const homeController = require("./../controllers/homeController");

const router = express.Router();

// router.param("id", tourController.checkID);

router.route("/").get(homeController.getHome);
//   .post(tourController.checkBody, tourController.createTour);

// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour)
//   .delete(tourController.deleteTour);

module.exports = router;
