const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

router.get('/current-jobs', employerController.getCurrentJobs);
router.get('/job-listings', employerController.getJobListings);
router.get('/profile', employerController.getProfile);
router.get('/transaction-history', employerController.getTransactionHistory);
router.get('/milestones', employerController.getMilestones);
router.get('/previously-worked', employerController.getPreviouslyWorked);
router.get('/subscription', employerController.getSubscription);


module.exports = router;