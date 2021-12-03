//Require Mongoose
var mongoose = require('mongoose');

const surrenderSchema = new mongoose.Schema({
  pet_id: String,
  status: String
});

const surrender = mongoose.model('surrender', surrenderSchema, "surrenders");

module.exports = surrender;