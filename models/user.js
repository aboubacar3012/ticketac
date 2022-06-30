const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
  name: String,
  firstame: String,
  email: String,
  password: String,
  journeys : { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' },
});

module.exports.userModel = mongoose.model('users', userSchema);
