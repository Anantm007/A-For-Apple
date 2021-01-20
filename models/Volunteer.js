const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    phone: {type: String, required: true, trim: true}
  },
  {timestamps: true}
);

module.exports = Volunteer = mongoose.model("Volunteer", volunteerSchema);
