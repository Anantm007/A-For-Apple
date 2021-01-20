const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    topic: {type: String, required: true, trim: true},
    location: {type: String, required: true, trim: true},
    date: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true}
  },
  {timestamps: true}
);

module.exports = Event = mongoose.model("Event", eventSchema);
