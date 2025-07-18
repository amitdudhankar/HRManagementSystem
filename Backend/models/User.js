const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  role: {
    type: String,
    enum: ["admin", "hr", "candidate"], // Optional: define allowed roles
    default: "hr", // Optional: default role if not specified
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
