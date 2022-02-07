const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  candlestick: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
