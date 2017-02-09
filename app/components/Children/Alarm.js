var React = require('react');

var Alarm = React.createClass({
	render: function(){
		if(this.props.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<p>Good Morning</p>
					<button className="btn btn-danger">Snooze</button>
				</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarm">
					<p>{this.props.nextAlarm}</p>
					<button data-toggle="modal" data-target="#setAlarm">Set an Alarm</button>
				</div>
			)
		}
	}
});

module.exports = Alarm;