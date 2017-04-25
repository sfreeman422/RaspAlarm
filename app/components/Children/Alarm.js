import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'

const alarmSound = new Audio("./sounds/alarm.mp3")
let alarmInterval;
let alarmsArr = [];

export default class Alarm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			alarmStatus: "not ringing",
			awake: false,
			alarms: []
		}
		this._getAlarms = this._getAlarms.bind(this);
		this._checkAlarm = this._checkAlarm.bind(this);
		this._awake = this._awake.bind(this);
	}
	_getAlarms(){
		$.ajax({
			url: "/alarms"
		}).done((alarms)=>{
			this.setState({alarms: alarms});
			this._checkAlarm();
		});
	}
	//Function to check whether its time for an alarm to go off or not.
	_checkAlarm(){
		let dayOfWeek = moment().format("dddd");
			for(let i =0; i < this.state.alarms.length;i++){
				for(let j=0; j < this.state.alarms[i].dayOfWeek.length; j++){
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
	}
	//This is veyr much a temporary function that will instead, open up a modal, allow the user to choose custom sounds and backgrounds and then save them so that the page will always render with the custom options. 
	_launchModal(){
		document.body.style.background = "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7) ), url('./bgs/waterfall.jpg')"
		document.body.style.backgroundSize = "cover"; 
	}
	componentDidMount(){
		this._getAlarms();
		alarmInterval = setInterval(this._checkAlarm, 1000);
	}
	componentWillUnmount(){
		clearInterval(alarmInterval);
	}
	_awake(){
		this.setState({
			alarmStatus: "not ringing",
			awake: true
		});
		//After 60 seconds, this will revert awake to false. We wait 60 to prevent the alarm from continously going off, even when the user is awake. 
		setTimeout(()=>this.setState({awake: false}), 60000);
	}
	render(){
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
					<h3 onClick={()=>this._launchModal()}> Change Background</h3>
				</div>
			)
		}
	}
}