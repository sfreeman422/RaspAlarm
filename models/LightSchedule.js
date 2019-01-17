const mongoose = require("mongoose");
const colorSchema = require("./ColorConfig");

const offSchedule = {
  start: String,
  end: String,
  groups: [Number]
};

const lightScheduleSchema = mongoose.Schema({
  dayOfWeek: String,
  off: [offSchedule],
  bedtime: String,
  colors: colorSchema
});

module.exports = mongoose.model("LightSchedule", lightScheduleSchema);
