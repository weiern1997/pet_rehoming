//Require Mongoose
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  admin: Boolean,
});

const User = mongoose.model('User', userSchema, "Users");

module.exports = User;