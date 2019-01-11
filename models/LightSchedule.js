const mongoose = require("mongoose");

const offSchedule = {
  start: String,
  end: String,
  groups: [Number]
};

const lightScheduleSchema = mongoose.Schema({
  dayOfWeek: String,
  off: [offSchedule],
  bedtime: String
});

module.exports = mongoose.model("LightSchedule", lightScheduleSchema);
