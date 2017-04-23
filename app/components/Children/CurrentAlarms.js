var React = require('react');
var Link = require('react-router').Link;

var CurrentAlarms = React.createClass({
	getInitialState: function(){
		return{
			listAlarms: []
		}
	},
	componentWillReceiveProps: function(nextProps){
		if(this.props.alarms != nextProps.alarms){
			this.setState({listAlarms: nextProps.alarms});			
		}
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
	_displayLetterForDayOfWeek: function(days){
		var dayOfWeek = {
			"Monday": "M",
			"Tuesday": "T",
			"Wednesday": "W",
			"Thursday": "Th",
			"Friday": "F",
			"Saturday": "Sat",
			"Sunday": "Sun"
		}
		var responseString = '';
		for(var i = 0 ; i< days.length; i++){
			if(i<days.length-1){
				responseString += dayOfWeek[days[i]]+" | "
			}
			else{
				responseString += dayOfWeek[days[i]]
			}
		}
		return responseString;
	},
	render: function(){
		if(this.state.listAlarms != undefined){
			return(
			<div className="col-xs-12" id="alarms">
				{this.state.listAlarms.map((alarm, i)=>{
					return (
						<div className="row" id="alarm" key={i}>
							<h3 id="alarmTime">{alarm.time}</h3>
							<p id="alarmDay">{this._displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
							<h3 onClick={()=>this._removeAlarm(alarm._id)} ><span className="glyphicon glyphicon-trash"><Link to="/alarmManager"></Link></span></h3>
						</div>
						)
				})}
			</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarms">
				</div>
			)
		}
		
	}
});

module.exports = CurrentAlarms;