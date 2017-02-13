var React = require('react');
var ClockPicker = require('react-clockpicker')
var AlarmManager = React.createClass({
	getInitialState: function(){
		return{
			hour: 1,
			minute: 30,
			ampm: "am"
		}
	},
	_incrementHour: function(){
		if(this.state.hour == 12){
			this.setState({
				hour: 1
			});
		}
		else{
			this.setState({
				hour: this.state.hour+1
			});
		}
	},
	_incrementMinute: function(){
		if(this.state.minute == 55){
			this.setState({
				minute: 0
			});
		}
		else{
			this.setState({
				minute: this.state.minute+5
			})
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
	render: function(){
		return(
		<div className="container verticalCenter" id="alarmManager">
			<div className="row">
				<div className="col-xs-12" id="timeSet">
					<h1 id="unselectable" onClick={this._incrementHour}>{this.state.hour}</h1><h1 id="unselectable">:</h1><h1 id="unselectable" onClick={this._incrementMinute}>{this.state.minute}</h1><h1 id="unselectable" onClick={this._changeAMPM}>{this.state.ampm}</h1>
				</div>
			</div>
			<div className="row">
				<div className="col-xs-12" id="daysOfWeek">
					<h3>Which days would you like to set this alarm for?</h3>
					<p>Monday    Tuesday    Wednesday   Thursday   Friday   Saturday   Sunday</p>
				</div>
			</div>
		</div>
		)
	}
});

module.exports = AlarmManager;