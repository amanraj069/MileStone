const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { upload } = require("../middleware/imageUpload");

router.get("/", adminController.getAdminDashboard);
router.get("/job_listings", adminController.getJobListings);
router.get("/freelancers", adminController.getFreelancers);
router.get("/employers", adminController.getEmployers);
router.get("/complaints", adminController.getComplaints);
router.post(
  "/complaints/:complaintId/resolve",
  adminController.resolveComplaint
);
router.post(
  "/complaints/:complaintId/dismiss",
  adminController.dismissComplaint
);
router.get("/profile", adminController.getProfile);
router.get("/profile/edit", adminController.getEditProfile);
router.post("/profile/edit", adminController.updateProfile);
router.post("/profile/upload-image", upload.single('picture'), adminController.uploadProfileImage);
router.delete("/employers/:userId", adminController.deleteEmployer);
router.delete("/freelancers/:userId", adminController.deleteFreelancer);

// Rating update routes
router.put(
  "/freelancers/:userId/rating",
  adminController.updateFreelancerRating
);
router.put("/employers/:userId/rating", adminController.updateEmployerRating);

// New quiz routes
router.get("/quizzes", adminController.getQuizzes);
router.get("/quizzes/add", adminController.getAddQuiz);
router.post("/quizzes/add", adminController.addQuiz);
router.delete("/quizzes/:skillId", adminController.deleteQuiz);
router.get("/quizzes/edit/:skillId", adminController.getEditQuiz);
router.post("/quizzes/edit/:skillId", adminController.updateQuiz);

module.exports = router;
