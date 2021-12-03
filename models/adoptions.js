//Require Mongoose
var mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet_id: String,
  status: String
});

const adoption = mongoose.model('adoption', adoptionSchema, "adoptions");

module.exports = adoption;