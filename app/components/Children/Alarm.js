var React = require('react');

var Alarm = React.createClass({
	render: function(){
		if(this.props.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<p>Good Morning</p>
					<button className="btn-xl btn-danger" id="snooze">Snooze</button>
					<button className="btn-xl btn-success" id="wakeUp">Wake Up</button>
				</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarm">
					<p>{this.props.nextAlarm}</p>
					<button className="btn-xl btn-default" data-toggle="modal" data-target="#setAlarm">Set an Alarm</button>
				</div>
			)
		}
	}
});

module.exports = Alarm;