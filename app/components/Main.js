var React = require('react');
var moment = require('moment');

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

//Require the helper functions
var helpers = require('./utils/helpers.js');

//Gloabal variable to will hold the weather results to updatte the state. 
var weatherResults; 
var lat;
var long;
//Global variables to hold the values of our day. 
var time; 
var date;
var today;
var weatherOne;
var weatherTwo;
var weatherThree;
var weatherFour;
var weatherFive;

var Main = React.createClass({
	getInitialState: function(){
		return{
			time: undefined,
			location: undefined,
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
	_getWeatherToday: function(){
		var weatherKey = "a1fdaf6002affae9c9357ffa9a25e0df";
		return $.ajax({
			url: "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID="+weatherKey
		}).done(function(response){
			 weatherResults = response.data.weather[0].main;
			 console.log(weatherResults);
			})
	},
	_getTime: function(){
		this.setState({
			time: moment().format("hh:mm"+"a"),
			date: moment().format("MMMM Do YYYY"),
			today: moment().format("dddd")
		}) 
	},
	componentWillMount: function(){
		//Function to get the location of our user based on HTML5 Geolocation. 
		function getLocation(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(setPosition);
			}else{
				console.log("Geoloc not supported. Unable to get location.");
			}
		}
		//Function to assign our location to the lat and long variables. 
		function setPosition(position){
			lat = position.coords.latitude;
			long = position.coords.longitude; 
			console.log("Position set at: ");
			console.log("Lat: "+lat);
			console.log("Long: "+long);
		}
		//Call get location to get us set with lat and long for the weather call. 
		getLocation();
		//Get the time every one second, this will also setState for time to the current time. 
		setInterval(this._getTime, 100);
		this.setState({
			lat: lat,
			long: long,
			date: moment().format("MMMM Do YYYY"),
			today: moment().format("dddd"),
			weatherToday: this._getWeatherToday,
			weatherHourOne: weatherOne,
			weatherHourTwo: weatherTwo,
			weatherHourThree: weatherThree,
			weatherHourFour: weatherFour,
			weatherHourFive: weatherFive
		});
	},
	componentDidMount: function(){
		this._getWeatherToday();
		this.setState({
			weatherToday: weatherResults,
			weatherHourOne: "test0",
			weatherHourTwo: "test1",
			weatherHourThree: "test2",
			weatherHourFour: "test3",
			weatherHourFive: "test4"
		})
	},
	render: function(){
		return(
			<div className="container">
				<div className="row">
					<Clock time={this.state.time}/>
				</div>
				<div className="row">
					<Today date={this.state.date} day={this.state.today}/>
				</div>
				<div className="row">
					<Weather today={this.state.weatherToday} one={this.state.weatherHourOne} two={this.state.weatherHourTwo} three={this.state.weatherHourThree} four={this.state.weatherHourFour} five={this.state.weatherHourFive}/>
				</div>
			</div>)
	}
});

module.exports = Main; 