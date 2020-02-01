const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: 'String',
  username:'String',
  password:'String',
  location: 'String',
  volunteers: 'String',
  timesUsed: Number,
  volunteerinfo:[String]
});

module.exports = NGO = mongoose.model('ngo', ngoSchema);
