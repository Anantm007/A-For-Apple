const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    location: {type: String, required: true, trim: true},
    volunteers: {type: String, required: true, trim: true},
    timesUsed: {type: Number, required: true},
    volunteerinfo: [{type: String}]
  },
  {timestamps: true}
);

module.exports = NGO = mongoose.model("ngo", ngoSchema);
