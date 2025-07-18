const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  experience: Number,
  skills: String,
  location: String,
  status: {
    type: String,
    enum: ["Shortlisted", "Rejected", "Interested", "Not Connected","Connected"],
    default: "Not Connected",
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });  // This enables createdAt & updatedAt

module.exports = mongoose.model("Candidate", candidateSchema);
