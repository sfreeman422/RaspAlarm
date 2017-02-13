var React = require('react');
var ClockPicker = require('react-clockpicker')
var AlarmManager = React.createClass({
	getInitialState: function(){
		return{
			hour: 1,
			minute: 30,
			ampm: "am",
			hourDisplay: "01",
			minuteDisplay: "30"
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
				ampm: ampm
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
					<p>Monday    Tuesday    Wednesday   Thursday   Friday   Saturday   Sunday</p>
					<h3 className="unselectable" onClick={this._setAlarm}>Set That Ish</h3>
				</div>
			</div>
		</div>
		)
	}
});

module.exports = AlarmManager;