const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Educational Blogs", "Technology Blogs", "News & Latest Trend", "Career Growth"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  minReadTime: {
    type: Number,
    required: true,
    min: 1,
  },
  content: [{
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    }
  }],
  featured: {
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredAt: {
      type: Date,
      default: null,
    },
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
  author: {
    type: String,
    default: "FreelancerHub Team",
  },
  views: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for search functionality
blogSchema.index({ title: 'text', tagline: 'text' });

// Virtual for formatted creation date
blogSchema.virtual('formattedCreatedAt').get(function() {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return this.createdAt.toLocaleDateString('en-US', options);
});

// Virtual for read time display
blogSchema.virtual('readTimeDisplay').get(function() {
  return `${this.minReadTime} min read`;
});

// Method to toggle featured status
blogSchema.methods.toggleFeatured = function() {
  this.featured.isFeatured = !this.featured.isFeatured;
  this.featured.featuredAt = this.featured.isFeatured ? new Date() : null;
  return this.save();
};

// Static method to get featured blog
blogSchema.statics.getFeaturedBlog = function() {
  return this.findOne({ 
    'featured.isFeatured': true,
    status: 'published'
  }).sort({ 'featured.featuredAt': -1 });
};

// Static method to get recent blogs
blogSchema.statics.getRecentBlogs = function(limit = 6) {
  return this.find({ 
    status: 'published',
    'featured.isFeatured': false
  }).sort({ createdAt: -1 }).limit(limit);
};

module.exports = mongoose.model('Blog', blogSchema);