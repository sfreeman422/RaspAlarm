var React = require('react');

var CurrentAlarms = React.createClass({
	_removeAlarm: function(id){
		$.ajax({
			url: "/deleteAlarm",
			type: "DELETE",
			data: {
				id: id,
				_method: "delete"
			}
		});
	},
	render: function(){
		return(
			<div className="col-xs-12" id="alarms">
				{this.props.alarms.map((alarm, i)=>{
					return (
						<div className="row" id="alarm" key={i}>
							<h3>{alarm.time}</h3>
							<p>{alarm.dayOfWeek}</p>
							<h3 onClick={this._removeAlarm(alarm._id)} ><span className="glyphicon glyphicon-trash"></span></h3>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CurrentAlarms;