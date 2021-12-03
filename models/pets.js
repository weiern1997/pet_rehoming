//Require Mongoose
var mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  breed: String,
  colour: String,
  size: String,
  fur_length: String,
  vaccinated: Boolean,
  dewormed: Boolean,
  spayed_neutered: Boolean,
  health: String,
  about: String,
  img:
    {
        data: Buffer,
        contentType: String
    }
});

const Pet = mongoose.model('Pet', petSchema, "Pets");

module.exports = Pet;