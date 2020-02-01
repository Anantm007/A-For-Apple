const mongoose = require('mongoose');

const volunteerSchema  = new mongoose.Schema({
  name:'String',
  phone:'String'
});

module.exports = Volunteer = mongoose.model('Volunteer', volunteerSchema);
