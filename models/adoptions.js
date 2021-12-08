//Require Mongoose
var mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet_id: String,
  status: String,
  owner_id: String
});

const adoption = mongoose.model('adoption', adoptionSchema, "adoptions");

module.exports = adoption;