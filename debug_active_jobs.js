// Debug script to check active jobs in database
require('dotenv').config();
const mongoose = require('mongoose');
const JobListing = require('./models/job_listing');
const User = require('./models/user');

async function debugActiveJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all jobs with assigned freelancers
    const allJobsWithFreelancers = await JobListing.find({
      "assignedFreelancer.freelancerId": { $ne: "" }
    }).lean();

    console.log('\n=== ALL JOBS WITH ASSIGNED FREELANCERS ===');
    console.log(`Total count: ${allJobsWithFreelancers.length}\n`);

    if (allJobsWithFreelancers.length > 0) {
      allJobsWithFreelancers.forEach((job, index) => {
        console.log(`Job ${index + 1}:`);
        console.log(`  Job ID: ${job.jobId}`);
        console.log(`  Title: ${job.title}`);
        console.log(`  Status: ${job.status}`);
        console.log(`  Assigned Freelancer ID: ${job.assignedFreelancer.freelancerId}`);
        console.log(`  Freelancer Status: ${job.assignedFreelancer.status}`);
        console.log(`  Start Date: ${job.assignedFreelancer.startDate}`);
        console.log('---');
      });
    }

    // Find jobs specifically with "working" status
    const workingJobs = await JobListing.find({
      "assignedFreelancer.status": "working"
    }).lean();

    console.log('\n=== JOBS WITH "WORKING" STATUS ===');
    console.log(`Total count: ${workingJobs.length}\n`);

    if (workingJobs.length > 0) {
      workingJobs.forEach((job, index) => {
        console.log(`Working Job ${index + 1}:`);
        console.log(`  Job ID: ${job.jobId}`);
        console.log(`  Title: ${job.title}`);
        console.log(`  Assigned Freelancer ID: ${job.assignedFreelancer.freelancerId}`);
        console.log('---');
      });
    }

    // Get all freelancers from User collection
    const freelancers = await User.find({ role: 'Freelancer' })
      .select('userId roleId name')
      .lean();

    console.log('\n=== ALL FREELANCERS IN SYSTEM ===');
    console.log(`Total count: ${freelancers.length}\n`);
    
    freelancers.forEach((freelancer, index) => {
      console.log(`Freelancer ${index + 1}:`);
      console.log(`  User ID: ${freelancer.userId}`);
      console.log(`  Role ID: ${freelancer.roleId}`);
      console.log(`  Name: ${freelancer.name}`);
      
      // Check if this freelancer has any working jobs
      const freelancerWorkingJobs = workingJobs.filter(
        job => job.assignedFreelancer.freelancerId === freelancer.roleId
      );
      
      console.log(`  Active Jobs: ${freelancerWorkingJobs.length}`);
      if (freelancerWorkingJobs.length > 0) {
        freelancerWorkingJobs.forEach(job => {
          console.log(`    - ${job.title} (ID: ${job.jobId})`);
        });
      }
      console.log('---');
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugActiveJobs();
