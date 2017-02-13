var React = require('react');

var AlarmManager = React.createClass({
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
				</div>
			</div>
		</div>
		)
	}
});

module.exports = AlarmManager;