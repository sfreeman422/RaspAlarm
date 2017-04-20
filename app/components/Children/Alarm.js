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
			alarmStatus: "not ringing",
			awake: false,
			alarms: []
		}
	},
	_getAlarms: function(){
		$.ajax({
			url: "/alarms"
		}).done((alarms)=>{
			this.setState({alarms: alarms});
			this._checkAlarm();
		});
	},
	//Function to check whether its time for an alarm to go off or not.
	_checkAlarm: function(){
		var dayOfWeek = moment().format("dddd");
			for(var i =0; i < this.state.alarms.length;i++){
				for(var j=0; j < this.state.alarms[i].dayOfWeek.length; j++){
					//If the alarm is not ringing, ring the alarm and set the state. This should only happen once. 
					if(this.props.currentTime == this.state.alarms[i].time && this.state.alarms[i].dayOfWeek[j] == dayOfWeek && this.state.alarmStatus != "ringing" && this.state.awake == false){
						alarmSound.play();
						this.setState({
							alarmStatus: "ringing"
						});
					}
					//If the alarmStatus is already ringing, we just want to play the alarmSound. So we do this. 
					else if(this.state.alarmStatus=="ringing"){
						alarmSound.play();
					}
				}
			}	
	},
	componentDidMount: function(){
		this._getAlarms();
		alarmInterval = setInterval(this._checkAlarm, 1000); 
	},
	componentWillUnmount: function(){
		clearInterval(alarmInterval);
	},
	_awake: function(){
		this.setState({
			alarmStatus: "not ringing",
			awake: true
		});
		//60 Seconds after waking up, we want to change awake state back to false so that we can get ready for our next alarm. 
		setTimeout(()=>this.setState({ awake: false}), 60000);
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