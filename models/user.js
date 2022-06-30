const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: {type: String, unique: true},
  password: String,
  journeys : { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' },
});

module.exports.userModel = mongoose.model('users', userSchema);
