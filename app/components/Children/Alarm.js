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
	_getAlarms: function(){
		$.ajax({
			url:"/alarms"
		}).done((alarms)=>{
			for(var i=0; i<alarms.length;i++){
				alarmsArr.push(alarms[i]);
			}
			console.log("Alarms Arr: ");
			console.log(alarmsArr);
		})
	},
	//Function to check whether its time for an alarm to go off or not.
	_checkAlarm: function(){
		var dayOfWeek = moment().format("dddd");
			for(var i =0; i<alarmsArr.length;i++){
				for(var j=0; j<alarmsArr[i].dayOfWeek.length; j++){
					//If the alarm is not ringing, ring the alarm and set the state. This should only happen once. 
					if(this.props.currentTime == alarmsArr[i].time && alarmsArr[i].dayOfWeek[j] == dayOfWeek && this.state.alarmStatus !== "ringing" && this.state.snoozed == false && this.state.awake == false){
						alarmSound.play();
						this.setState({
							alarmStatus: "ringing"
						});
					}
					//If the alarmStatus is already ringing, we just want to play the alarmSound. So we do this. 
					else if(this.props.currentTime == alarmsArr[i].time && alarmsArr[i].dayofWeek[j] == dayOfWeek && this.state.alarmStatus=="ringing" && this.state.snoozed == false && this.state.awake == false){
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
	},
	componentWillMount: function(){
		this._getAlarms();
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
			awake: true
		});
		console.log("Awake Status Before: "+this.state.awake);
		setTimeout(()=>this.setState({ awake: false}), 60000);
		console.log("Awake status after: "+this.state.awake);
	},
	render: function(){
		if(this.state.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<button className="btn-xl btn-danger" id="snooze" onClick={()=>{this._snooze()}}>Snooze</button>
					<button className="btn-xl btn-success" id="wakeUp" onClick={()=>{this._awake()}}>Wake Up</button>
				</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarm">
					<h3><Link to="/AlarmManager">Set an Alarm</Link></h3>
				</div>
			)
		}
	}
});

module.exports = Alarm;