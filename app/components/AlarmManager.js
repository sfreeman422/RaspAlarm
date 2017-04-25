import React from 'react'
import { Link } from 'react-router'
import CurrentAlarms from './Children/CurrentAlarms'

let daysOfWeek = [];
let alarmsArr = [];

export default class AlarmManager extends React.Component {
	constructor(){
		super();
		this.state = {
			hour: 1,
			minute: 30,
			ampm: "am",
			hourDisplay: "01",
			minuteDisplay: "30",
			monday: "unselected",
			tuesday: "unselected",
			wednesday: "unselected",
			thursday: "unselected",
			friday: "unselected",
			saturday: "unselected",
			sunday: "unselected",
			alarms: []
		}
		this._incrementHour = this._incrementHour.bind(this);
		this._incrementMinute = this._incrementMinute.bind(this);
		this._changeAMPM = this._changeAMPM.bind(this);
		this._chooseDay = this._chooseDay.bind(this);
		this._getAlarms = this._getAlarms.bind(this);
		this._setAlarm = this._setAlarm.bind(this);
	}
	_incrementHour(){
		if(this.state.hour == 12){
			this.setState({
				hour: 1,
				hourDisplay: "01"
			});
		}
		else if(this.state.hour < 10){
			//Grab what our hour will be.
			var stringHour = this.state.hour+1;
			if(stringHour == 10){
				this.setState({
					hour: 10,
					hourDisplay: 10
				});
			}
			else{
				this.setState({
					hour: this.state.hour+1,
					hourDisplay: "0"+stringHour.toString()
				});
			}
		}
		else{
			this.setState({
				hour: this.state.hour+1,
				hourDisplay: this.state.hour+1
			});
		}
	}
	_incrementMinute(){
		if(this.state.minute == 55){
			this.setState({
				minute: 0,
				minuteDisplay: "00"
			});
		}
		else if(this.state.minute < 10){
				//Grab what the minute will be for the minuteDisplay
				var stringMinute = this.state.minute+5
				if(stringMinute == 10){
					this.setState({
						minute: stringMinute,
						minuteDisplay: stringMinute
					})
				}
				else{
					this.setState({
						minute: this.state.minute+5,
						minuteDisplay: "0"+stringMinute.toString()
					});					
				}
		}
		else{
			this.setState({
				minute: this.state.minute+5,
				minuteDisplay: this.state.minute+5
			});
		}
	}
	_changeAMPM(){
		if(this.state.ampm == "am"){
			this.setState({
				ampm: "pm"
			});
		}
		else{
			this.setState({
				ampm:"am"
			})
		}
	}
	_chooseDay(day){
		if(day == "Monday"){
			if(this.state.monday == "unselected"){
				this.setState({
					monday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					monday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Monday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Tuesday"){
			if(this.state.tuesday == "unselected"){
				this.setState({
					tuesday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					tuesday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Tuesday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Wednesday"){
			if(this.state.wednesday == "unselected"){
				this.setState({
					wednesday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					wednesday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Wednesday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Thursday"){
			if(this.state.thursday == "unselected"){
				this.setState({
					thursday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					thursday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Thursday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Friday"){
			if(this.state.friday == "unselected"){
				this.setState({
					friday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					friday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Friday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Saturday"){
			if(this.state.saturday == "unselected"){
				this.setState({
					saturday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					saturday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Saturday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
		else if(day == "Sunday"){
			if(this.state.sunday == "unselected"){
				this.setState({
					sunday: "selected"
				});
				daysOfWeek.push(day);
			}
			else{
				this.setState({
					sunday: "unselected"
				});
				for(var i = 0; i <daysOfWeek.length; i++){
					if(daysOfWeek[i] == "Sunday"){
						daysOfWeek.splice(i, 1);
					}
				}
			}
		}
	}
	_getAlarms(){
		$.ajax({
			url:"/alarms",
			type:"get"
		}).done((alarms)=>{
			this.setState({alarms: alarms});
		});
	}
	componentDidMount(){
		this._getAlarms();
	}
	_setAlarm(){
		let hour = this.state.hourDisplay;
		let minute = this.state.minuteDisplay;
		let ampm = this.state.ampm;
		$.ajax({
			url: "/setAlarm",
			type: "POST",
			data: {
				hour: hour,
				minute: minute,
				ampm: ampm,
				dayOfWeek: daysOfWeek
			}
		}).done((response)=>{
			this.setState({
				monday: "unselected",
				tuesday: "unselected",
				wednesday: "unselected",
				thursday: "unselected",
				friday: "unselected",
				saturday: "unselected",
				sunday: "unselected"
			});
			daysOfWeek = []; 
			this._getAlarms();
		});
	}
	render(){
		return(
				<div className="container" id="alarmManager">
					<div className="row">
						<div className="col-xs-12" id="timeSet">
							<h1 className="unselectable" id="hour" onClick={this._incrementHour}>{this.state.hourDisplay}</h1><h1 className="unselectable">:</h1><h1 className="unselectable" id="minute" onClick={this._incrementMinute}>{this.state.minuteDisplay}</h1><h1 className="unselectable" id="ampm" onClick={this._changeAMPM}>{this.state.ampm}</h1>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12" id="daysOfWeek">
							<h3 id="alarmManagerPrompt">Which days would you like to set this alarm for?</h3>
							<h3 className="unselectable dayOfWeek" id={this.state.monday} onClick={()=>{this._chooseDay("Monday")}}>M</h3><h3 className="unselectable dayOfWeek" id={this.state.tuesday} onClick={()=>{this._chooseDay("Tuesday")}}>T</h3><h3 className="unselectable dayOfWeek" id={this.state.wednesday} onClick={()=>{this._chooseDay("Wednesday")}}>W</h3><h3 className="unselectable dayOfWeek" id={this.state.thursday} onClick={()=>{this._chooseDay("Thursday")}}>Th</h3><h3 className="unselectable dayOfWeek" id={this.state.friday} onClick={()=>{this._chooseDay("Friday")}}>Fri</h3><h3 className="unselectable dayOfWeek" id={this.state.saturday} onClick={()=>{this._chooseDay("Saturday")}}>Sat</h3><h3 className="unselectable dayOfWeek" id={this.state.sunday} onClick={()=>{this._chooseDay("Sunday")}}>Sun</h3>
							
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<h3 className="unselectable" id="setAlarm" onClick={this._setAlarm}>Set Alarm</h3>
							<h3 className="unselectable" id="displayBlock"><Link to="/">Back to Clock</Link></h3>
						</div>
					</div>
					<CurrentAlarms alarms={this.state.alarms}/>
				</div>
			)
	}
}