const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to MongoDB using the same connection as the main app
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
});

async function checkRatings() {
  try {
    console.log('Checking current rating status...\n');
    
    // Get all freelancers and employers
    const users = await User.find({
      role: { $in: ['Freelancer', 'Employer'] }
    }).sort({ role: 1, name: 1 });

    console.log('Current User Ratings:');
    console.log('====================');
    
    let freelancerCount = 0;
    let employerCount = 0;
    
    users.forEach(user => {
      const rating = user.rating || 'No rating';
      console.log(`${user.name} (${user.role}): ${rating}`);
      
      if (user.role === 'Freelancer') freelancerCount++;
      if (user.role === 'Employer') employerCount++;
    });

    console.log('\nSummary:');
    console.log(`- Total Freelancers: ${freelancerCount}`);
    console.log(`- Total Employers: ${employerCount}`);
    console.log(`- Total Users: ${users.length}`);

    // Show rating distribution
    const ratingStats = await User.aggregate([
      { $match: { role: { $in: ['Freelancer', 'Employer'] } } },
      {
        $group: {
          _id: '$role',
          avgRating: { $avg: '$rating' },
          minRating: { $min: '$rating' },
          maxRating: { $max: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\nRating Statistics:');
    console.log('==================');
    ratingStats.forEach(stat => {
      console.log(`${stat._id}: Avg ${stat.avgRating.toFixed(1)}, Range ${stat.minRating}-${stat.maxRating}, Count ${stat.count}`);
    });

    // Check for users without ratings
    const usersWithoutRatings = await User.find({
      role: { $in: ['Freelancer', 'Employer'] },
      $or: [
        { rating: { $exists: false } },
        { rating: null }
      ]
    });

    if (usersWithoutRatings.length > 0) {
      console.log(`\n⚠️  Found ${usersWithoutRatings.length} users without ratings:`);
      usersWithoutRatings.forEach(user => {
        console.log(`   - ${user.name} (${user.role})`);
      });
    } else {
      console.log('\n✅ All users have ratings assigned!');
    }

  } catch (error) {
    console.error('Error checking ratings:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the check
checkRatings();
