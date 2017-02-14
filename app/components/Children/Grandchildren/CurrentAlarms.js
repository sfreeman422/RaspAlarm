var React = require('react');

var CurrentAlarms = React.createClass({
	render: function(){
		return(
			<div className="alarms">
				{this.props.alarms.map(function(alarm, i){
					return (
						<div className="row" id="alarm" key={i}>
							<h3>{alarm.time}</h3>
							<p>{alarm.dayOfWeek}</p>
							<p>Trash Icon</p>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CurrentAlarms;