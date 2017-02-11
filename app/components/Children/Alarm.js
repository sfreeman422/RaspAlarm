var React = require('react');
var moment = require('moment');

//AlarmClock Sound
var alarmSound = new Audio("./sounds/alarm.mp3")

var Alarm = React.createClass({
	getInitialState: function(){
		return{
			alarmStatus: undefined,
			snoozed: false,
			awake: false
		}
	},
	//Function to check whether its time for an alarm to go off or not.
	_checkAlarm: function(){
		var dayOfWeek = moment().format("dddd");
		$.ajax({
			url: "/alarms"
		}).done((alarms) =>{
			for(var i =0; i<alarms.length;i++){
				for(var j=0; j<alarms[i].dayOfWeek.length; j++){
					//If the alarm is not ringing, ring the alarm and set the state. This should only happen once. 
					if(this.props.currentTime == alarms[i].time && alarms[i].dayOfWeek[j] == dayOfWeek && this.state.alarmStatus !== "ringing" && this.state.snoozed == false && this.state.awake == false){
						alarmSound.play();
						this.setState({
							alarmStatus: "ringing"
						});
					}
					//If the alarmStatus is already ringing, we just want to play the alarmSound. So we do this. 
					else if(this.props.currentTime == alarms[i].time && alarms[i].dayofWeek[j] == dayOfWeek && this.state.alarmStatus=="ringing" && this.state.snoozed == false && this.state.awake == false){
						alarmSound.play();
					}
					//Otherwise, just set the state to undefined. 
					else{
						this.setState({
							alarmStatus: undefined
						});
					}
				}
			}
		})
	},
	componentDidMount: function(){
		this._checkAlarm();
		setInterval(this._checkAlarm, 100); 
	},
	_snooze: function(){
		this.setState({
			snoozed: true
		});
	},
	_awake: function(){
		this.setState({
			awake: true
		});
	},
	render: function(){
		if(this.state.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<p>Good Morning</p>
					<button className="btn-xl btn-danger" id="snooze" onClick={()=>{this._snooze()}}>Snooze</button>
					<button className="btn-xl btn-success" id="wakeUp" onClick={()=>{this._awake()}}>Wake Up</button>
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