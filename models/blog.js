const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '')    // Remove non-alphanumeric
    .replace(/-+/g, '-')             // Collapse dashes
    .replace(/^-+|-+$/g, '');        // Trim dashes
}

const blogSchema = new mongoose.Schema({
  slug: {
    type: String,
    default: function() {
      // Use title + uuid for uniqueness
      return this.title ? `${slugify(this.title)}-${uuidv4().slice(0,8)}` : uuidv4();
    },
    index: { unique: true, sparse: true }
  },
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
// ensure unique sparse index on slug via field definition rather than schema.index to avoid duplicates

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
/**
 * Get recent blogs helper
 * @param {number} limit - number of posts to return
 * @param {boolean} includeFeatured - whether to include featured posts
 * @param {Array<string>} excludeIds - list of blogId values to exclude
 */
blogSchema.statics.getRecentBlogs = function(limit = 6, includeFeatured = true, excludeIds = []) {
  const query = { status: 'published' };
  if (!includeFeatured) query['featured.isFeatured'] = false;
  if (excludeIds && excludeIds.length) query.blogId = { $nin: excludeIds };

  return this.find(query).sort({ createdAt: -1 }).limit(limit);
};

module.exports = mongoose.model('Blog', blogSchema);