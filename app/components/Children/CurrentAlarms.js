var React = require('react');
var Link = require('react-router').Link;

var CurrentAlarms = React.createClass({
	getInitialState: function(){
		return{
			listAlarms: this.props.alarms
		}
	},
	componentWillMount: function(){
		this._getAlarms();
	},
	_getAlarms: function(){
		$.ajax({
			url: "/alarms",
			type: "get"
		}).done((alarms)=>{
			this.setState({
				listAlarms: alarms
			});
		});
	},
	componentDidUpdate: function(){
		this._getAlarms();
	},
	_removeAlarm: function(id){
		$.ajax({
			url: "/deleteAlarm",
			type: "DELETE",
			data: {
				id: id,
				_method: "delete"
			}
		}).done((alarms)=>{
			this._getAlarms();
		});
	},
	render: function(){
		return(
			<div className="col-xs-12" id="alarms">
				{this.state.listAlarms.map((alarm, i)=>{
					return (
						<div className="row" id="alarm" key={i}>
							<h3 id="alarmTime">{alarm.time}</h3>
							<p id="alarmDay">{alarm.dayOfWeek}</p>
							<h3 onClick={()=>this._removeAlarm(alarm._id)} ><span className="glyphicon glyphicon-trash"><Link to="/alarmManager"></Link></span></h3>
						</div>
						)
				})}
			</div>
		)
	}
});

module.exports = CurrentAlarms;