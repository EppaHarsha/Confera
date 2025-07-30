const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
