var React = require('react');
var moment = require('moment');

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

//Require the helper functions
var helpers = require('./utils/helpers.js');

var Main = React.createClass({
	getInitialState: function(){
		return{
			time: undefined,
			date: undefined,
			today: undefined,
			weatherToday: undefined,
			weatherHourOne: undefined, 
			weatherHourTwo: undefined,
			weatherHourThree: undefined,
			weatherHourFour: undefined,
			weatherHourFive: undefined
		}
	},
	_setInfo: function(time, date, today, weatherToday, weatherOne, weatherTwo, weatherThree, weatherFour, weatherFive){
		this.setState({
			time: time,
			date: date,
			today: today, 
			weatherToday: weatherToday,
			weatherHourOne: weatherOne,
			weatherHourTwo: weatherTwo,
			weatherHourThree: weatherThree,
			weatherHourFour: weatherFour,
			weatherHourFive: weatherFive
		})
	},
	componentDidUpdate: function(prevProps, prevState){
		if(prevState != this.state){
			console.log("Something has changed...");

			//Code will go here to get the time and other fun stuff on a recurring basis to ensure that we have the latest information. 
			
		}
	},
	componentDidMount: function(){
		//Code to get time, date and weather data. 
		var time = moment().format("hh:mm"+"a");
		var date = moment().format("MMMM Do YYYY");
		var today = moment().format("dddd");
		var weatherToday = "Weather Today";
		var weatherOne = "WeatherOne";
		var weatherTwo = "WeatherTwo";
		var weatherThree = "WeatherThree";
		var weatherFour = "WeatherFour";
		var weatherFive = "WeatherFive";
		this.setState({
			time: time,
			date: date,
			today: today,
			weatherToday: weatherToday,
			weatherHourOne: weatherOne,
			weatherHourTwo: weatherTwo,
			weatherHourThree: weatherThree,
			weatherHourFour: weatherFour,
			weatherHourFive: weatherFive
		});
	},
	render: function(){
		return(
			<div className="container">
				<div className="row">
					<Clock time={this.state.time}/>
				</div>
				<div className="row">
					<Today date={this.state.date}/>
				</div>
				<div className="row">
					<Weather today={this.state.weatherToday} one={this.state.weatherHourOne} two={this.state.weatherHourTwo} three={this.state.weatherHourThree} four={this.state.weatherHourFour} five={this.state.weatherHourFive}/>
				</div>
			</div>)
	}
});

module.exports = Main; 