const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  topic:'String',
  location:'String',
  date:'String',
  description:'String'
});

module.exports = Event = mongoose.model('Event', eventSchema);
