var mongoose = require('mongoose');

var alarmSchema = mongoose.Schema({
		time: String,
		dayOfWeek: Array
});

module.exports = mongoose.model("Alarm", alarmSchema); 