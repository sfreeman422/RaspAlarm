const mongoose = require("mongoose");

const alarmSchema = mongoose.Schema({
  time: String,
  dayOfWeek: Array,
  oneTimeUse: Boolean
});

module.exports = mongoose.model("Alarm", alarmSchema);
