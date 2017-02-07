var mongoose = require('mongoose');

var alarmSchema = mongoose.Schema({
	alarm:{
		time: String,
		monday: Boolean,
		tuesday: Boolean,
		wednesday: Boolean,
		thursday: Boolean,
		friday: Boolean,
		saturday: Boolean,
		sunday: Boolean
	}
});

module.exports = mongoose.model("Alarm", alarmSchema); 