//Require Mongoose
var mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  company: String,
  outlet: [String]
});

const Client = mongoose.model('Client', clientSchema, "Clients");

module.exports = Client;