var React = require('react');

var Alarm = React.createClass({
	render: function(){
		return(
			<div className="col-xs-12" id="alarm">
				<p>{this.props.alarmStatus}</p>
				<button>Set an Alarm</button>
			</div>
			)
	}
});

module.exports = Alarm;