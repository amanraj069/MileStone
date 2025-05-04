const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const adminSchema = new Schema({
  adminId: { 
    type: String, 
    required: true, 
    unique: true,
    default: uuidv4 
  },
  userId: { 
    type: String, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true 
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;