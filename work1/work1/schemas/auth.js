const mongoose = require("mongoose");

const auth = new mongoose.Schema({
  usernumber: {
    type: Number,
    required: true,
    unique: true
  },
  comment: {
    type: String,
    required: true,
  }
  
});

module.exports = mongoose.model("comment", authSchema);