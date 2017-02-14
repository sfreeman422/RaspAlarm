var React = require('react');

var CurrentAlarms = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12" id="alarms">
				{this.props.alarms.map(function(alarm, i){
					return (
						<div className="row" id="alarm" key={i}>
							<h3>{alarm.time}</h3>
							<p>{alarm.dayOfWeek}</p>
							<h3><span className="glyphicon glyphicon-trash"></span></h3>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CurrentAlarms;