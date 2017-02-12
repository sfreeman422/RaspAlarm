var React = require('react');

var AlarmManager = React.createClass({
	getInitialState: function(){

	},
	componentWillMount: function(){

	},
	render: function(){
		return(
		<div className="col-xs-12 verticalCenter" id="alarmManager">
			<div className="row">
				<div className="col-xs-12" id="timeSet">
					<h1>00:00am</h1>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12" id="daysOfWeek">
					<h3>Which days would you like to set this alarm for?</h3>
					<input type="checkbox" name="dayOfWeek" value="Monday">Monday</input>
      				<input type="checkbox" name="dayOfWeek" value="Tuesday">Tuesday</input>
      				<input type="checkbox" name="dayOfWeek" value="Wednesday">Wednesday</input>
      				<input type="checkbox" name="dayOfWeek" value="Thursday">Thursday</input>
      				<input type="checkbox" name="dayOfWeek" value="Friday">Friday</input>
      				<input type="checkbox" name="dayOfWeek" value="Saturday">Saturday</input>
      				<input type="checkbox" name="dayOfWeek" value="Sunday">Sunday</input>
				</div>
			</div>
		</div>
		)
	}
});

module.exports = AlarmManager;