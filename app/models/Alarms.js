const mongoose = require('mongoose');

const alarmSchema = mongoose.Schema({
  time: String,
  dayOfWeek: Array,
});

module.exports = mongoose.model('Alarm', alarmSchema);
