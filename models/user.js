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
      default:
        "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png",
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
