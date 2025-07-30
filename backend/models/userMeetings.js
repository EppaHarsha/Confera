const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  username: String,
  meetingId: String,
  title: String,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);