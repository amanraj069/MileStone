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

async function updateRatings() {
  try {
    console.log('Starting rating update process...');
    
    // Find all users with role Freelancer or Employer who don't have a rating or have default rating
    const usersToUpdate = await User.find({
      role: { $in: ['Freelancer', 'Employer'] },
      $or: [
        { rating: { $exists: false } },
        { rating: null },
        { rating: 4.5 } // Default rating from schema
      ]
    });

    console.log(`Found ${usersToUpdate.length} users to update`);

    let updatedCount = 0;
    
    for (const user of usersToUpdate) {
      // Generate random rating between 2 and 5 (inclusive)
      const newRating = Math.round((Math.random() * 3 + 2) * 10) / 10; // 2.0 to 5.0 with 1 decimal
      
      await User.updateOne(
        { userId: user.userId },
        { $set: { rating: newRating } }
      );
      
      console.log(`Updated ${user.name} (${user.role}): ${user.rating || 'no rating'} → ${newRating}`);
      updatedCount++;
    }

    console.log(`\nRating update completed!`);
    console.log(`Total users updated: ${updatedCount}`);
    
    // Show summary by role
    const freelancerCount = await User.countDocuments({ role: 'Freelancer' });
    const employerCount = await User.countDocuments({ role: 'Employer' });
    
    console.log(`\nSummary:`);
    console.log(`- Total Freelancers: ${freelancerCount}`);
    console.log(`- Total Employers: ${employerCount}`);
    
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
    
    console.log(`\nRating Statistics:`);
    ratingStats.forEach(stat => {
      console.log(`${stat._id}: Avg ${stat.avgRating.toFixed(1)}, Range ${stat.minRating}-${stat.maxRating}, Count ${stat.count}`);
    });

  } catch (error) {
    console.error('Error updating ratings:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update
updateRatings();
