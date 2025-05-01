// models/user.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String 
  },
  name: { 
    type: String 
  }
}, { 
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;