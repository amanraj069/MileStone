const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const subscriptionSchema = new Schema({
  subscriptionId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  planName: { 
    type: String,
    required: true 
  },
  price: { 
    type: Number,
    required: true 
  },
  features: [{ 
    type: String,
    default: [] 
  }],
  duration: { 
    type: String,
    required: true 
  }
}, { 
  timestamps: true 
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;