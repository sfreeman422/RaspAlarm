var React = require('react');
var Link = require('react-router').Link;

var daysOfWeek = [];
var AlarmManager = React.createClass({
	getInitialState: function(){
		return{
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
			sunday: "unselected"
		}
	},
	_incrementHour: function(){
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
	},
	_incrementMinute: function(){
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
	},
	_changeAMPM: function(){
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
	},
	_chooseDay: function(day){
		if(day == "monday"){
			if(this.state.monday == "unselected"){
				this.setState({
					monday: "selected"
				});
				daysOfWeek.push("Monday");
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
		else if(day == "tuesday"){
			if(this.state.tuesday == "unselected"){
				this.setState({
					tuesday: "selected"
				});
				daysOfWeek.push("Tuesday");
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
		else if(day == "wednesday"){
			if(this.state.wednesday == "unselected"){
				this.setState({
					wednesday: "selected"
				});
				daysOfWeek.push("Wednesday");
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
		else if(day == "thursday"){
			if(this.state.thursday == "unselected"){
				this.setState({
					thursday: "selected"
				});
				daysOfWeek.push("Thursday");
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
		else if(day == "friday"){
			if(this.state.friday == "unselected"){
				this.setState({
					friday: "selected"
				});
				daysOfWeek.push("Friday");
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
		else if(day == "saturday"){
			if(this.state.saturday == "unselected"){
				this.setState({
					saturday: "selected"
				});
				daysOfWeek.push("Saturday");
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
		else if(day == "sunday"){
			if(this.state.sunday == "unselected"){
				this.setState({
					sunday: "selected"
				});
				daysOfWeek.push("Sunday");
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
		console.log("Day chosen is "+day);
		console.log("Days of week: "+daysOfWeek);
	},
	_setAlarm: function(){
		var hour = this.state.hourDisplay;
		var minute = this.state.minuteDisplay;
		var ampm = this.state.ampm;
		$.ajax({
			url: "/setAlarm",
			type: "POST",
			data: {
				hour: hour,
				minute: minute,
				ampm: ampm,
				dayOfWeek: daysOfWeek
			}
		});
	},
	render: function(){
		return(
		<div className="container verticalCenter" id="alarmManager">
			<div className="row">
				<div className="col-xs-12" id="timeSet">
					<h1 className="unselectable" id="hour" onClick={this._incrementHour}>{this.state.hourDisplay}</h1><h1 className="unselectable">:</h1><h1 className="unselectable" id="minute" onClick={this._incrementMinute}>{this.state.minuteDisplay}</h1><h1 className="unselectable" id="ampm" onClick={this._changeAMPM}>{this.state.ampm}</h1>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12" id="daysOfWeek">
					<h3>Which days would you like to set this alarm for?</h3>
					<h3 className="unselectable dayOfWeek" id={this.state.monday} onClick={()=>{this._chooseDay("monday")}}>M</h3><h3 className="unselectable dayOfWeek" id={this.state.tuesday} onClick={()=>{this._chooseDay("tuesday")}}>T</h3><h3 className="unselectable dayOfWeek" id={this.state.wednesday} onClick={()=>{this._chooseDay("wednesday")}}>W</h3><h3 className="unselectable dayOfWeek" id={this.state.thursday} onClick={()=>{this._chooseDay("thursday")}}>Th</h3><h3 className="unselectable dayOfWeek" id={this.state.friday} onClick={()=>{this._chooseDay("friday")}}>Fri</h3><h3 className="unselectable dayOfWeek" id={this.state.saturday} onClick={()=>{this._chooseDay("saturday")}}>Sat</h3><h3 className="unselectable dayOfWeek" id={this.state.sunday} onClick={()=>{this._chooseDay("sunday")}}>Sun</h3>
					<h3 className="unselectable" onClick={this._setAlarm}><Link to="/">Set That Ish</Link></h3>
				</div>
			</div>
		</div>
		)
	}
});

module.exports = AlarmManager;