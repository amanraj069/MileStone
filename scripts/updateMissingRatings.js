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

async function updateMissingRatings() {
  try {
    console.log('Starting missing rating update process...');
    
    // Find all users with role Freelancer or Employer who truly don't have a rating
    const usersToUpdate = await User.find({
      role: { $in: ['Freelancer', 'Employer'] },
      $or: [
        { rating: { $exists: false } },
        { rating: null }
      ]
    });

    console.log(`Found ${usersToUpdate.length} users without ratings`);

    if (usersToUpdate.length === 0) {
      console.log('No users found without ratings. All users already have ratings assigned.');
      return;
    }

    let updatedCount = 0;
    
    for (const user of usersToUpdate) {
      // Generate random rating between 2 and 5 (inclusive)
      const newRating = Math.round((Math.random() * 3 + 2) * 10) / 10; // 2.0 to 5.0 with 1 decimal
      
      await User.updateOne(
        { userId: user.userId },
        { $set: { rating: newRating } }
      );
      
      console.log(`Updated ${user.name} (${user.role}): no rating → ${newRating}`);
      updatedCount++;
    }

    console.log(`\nMissing rating update completed!`);
    console.log(`Total users updated: ${updatedCount}`);
    
    // Show current rating distribution
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
    
    console.log(`\nCurrent Rating Statistics:`);
    ratingStats.forEach(stat => {
      console.log(`${stat._id}: Avg ${stat.avgRating.toFixed(1)}, Range ${stat.minRating}-${stat.maxRating}, Count ${stat.count}`);
    });

  } catch (error) {
    console.error('Error updating missing ratings:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update
updateMissingRatings();
