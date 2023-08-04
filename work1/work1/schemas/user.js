const mongoose = require("mongoose");

const userinfoSchema = new mongoose.Schema({
  usernumber: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  pwd: {
    type: Number
  },
  category: {
    type: String
  },

});

module.exports = mongoose.model("User", userSchema);