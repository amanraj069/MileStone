const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const messageSchema = new Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    from: {
      type: String,
      ref: "User",
      required: true,
    },
    to: {
      type: String,
      ref: "User",
      required: true,
    },
    messageData: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;