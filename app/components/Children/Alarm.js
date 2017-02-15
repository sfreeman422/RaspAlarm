var React = require('react');
var moment = require('moment');
var Link = require('react-router').Link;
//AlarmClock Sound
var alarmSound = new Audio("./sounds/alarm.mp3")
var alarmInterval;
var alarmsArr = [];
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
		console.log("Checking alarm");
		var dayOfWeek = moment().format("dddd");
		$.ajax({
			url:"/alarms"
		}).done((alarms)=>{
			for(var i =0; i<alarms.length;i++){
				for(var j=0; j<alarms[i].dayOfWeek.length; j++){
					//If the alarm is not ringing, ring the alarm and set the state. This should only happen once. 
					if(this.props.currentTime == alarms[i].time && alarms[i].dayOfWeek[j] == dayOfWeek && this.state.alarmStatus !== "ringing" && this.state.snoozed == false && this.state.awake == false){
						alarmSound.play();
						this.setState({
							alarmStatus: "ringing"
						});
						console.log("Alarm should be playing.")
					}
					//If the alarmStatus is already ringing, we just want to play the alarmSound. So we do this. 
					else if(this.props.currentTime == alarms[i].time && alarms[i].dayofWeek[j] == dayOfWeek && this.state.alarmStatus=="ringing" && this.state.snoozed == false && this.state.awake == false){
						alarmSound.play();
						console.log("Alarm should be playing.")
					}
					//Otherwise, just set the state to undefined. 
					else{
						this.setState({
							alarmStatus: undefined
						});
						console.log("No Alarm");
					}
				}
			}
		});
			
	},
	componentWillMount: function(){
		this._checkAlarm();
		alarmInterval = setInterval(this._checkAlarm, 1000); 
	},
	componentWillUnmount: function(){
		clearInterval(alarmInterval);
	},
	_snooze: function(){
		this.setState({
			snoozed: true
		});
	},
	_awake: function(){
		this.setState({
			awake: true,
			alarmStatus: undefined
		});
		console.log("Awake Status Before: "+this.state.awake);
		setTimeout(()=>this.setState({ awake: false}), 60000);
		console.log("Awake status after: "+this.state.awake);
	},
	render: function(){
		if(this.state.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<button className="btn-xl btn-success" id="wakeUp" onClick={()=>{this._awake()}}>Wake Up</button>
				</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarm">
					<h3><Link to="/AlarmManager">Set an alarm</Link></h3>
				</div>
			)
		}
	}
});

module.exports = Alarm;