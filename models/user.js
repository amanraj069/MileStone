const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    socialMedia: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    aboutMe: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      ref: "Subscription",
      enum: ["Basic", "Premium"],
      default: "Basic",
    },
    role: {
      type: String,
      enum: ["Employer", "Freelancer", "Admin"],
      default: "",
    },
    roleId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
