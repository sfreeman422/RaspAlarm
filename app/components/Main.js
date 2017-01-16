var React = require('react');
var moment = require('moment');
var axios = require('axios');

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

//Require the helper functions
var helpers = require('./utils/helpers.js');

//Gloabal variable to will hold the weather results to updatte the state. 
var weatherResults; 
//Global Variables to hold the lat and longitude for use getting the weather. 
var lat;
var long;

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
		return axios.get("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID="+weatherKey)
			.then(function(response){
			 weatherResults = response.data.weather[0].main;
			 console.log(weatherResults);
	})
	},
	componentDidUpdate: function(prevProps, prevState){
		if(prevState != this.state){
			console.log("Something has changed...");
			this.render();
			//Code will go here to get the time and other fun stuff on a recurring basis to ensure that we have the latest information. 
		}
	},
	componentDidMount: function(){
		function getLocation(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(setPosition);
			}else{
				console.log("Geoloc not supported. Unable to get location.");
			}
		}
		function setPosition(position){
			lat = position.coords.latitude;
			long = position.coords.longitude; 
			console.log("Position set at: ");
			console.log("Lat: "+lat);
			console.log("Long: "+long);
		}
		getLocation()
			.then(this._getWeatherToday());

			//PRETTY SURE THAT WE WILL NEED A PROMISE HERE. We want to:
			//A. Run getLocation(), so that we have the proper lat and long
			//B. Then, run this._getWeatherToday() so that we can make the API call based on the lat/long.
			//C. Then, we want to set the state, once this._getWeatherToday() completes. 
			//If we can chain all of this together within a promise, I believe this should allow us to update the page
			//And avoid async issues. This is your #1 issue right now that needs to be resolved asap, but its late on a Sunday
		//Code to get time, date and weather data. 
		var time = moment().format("hh:mm"+"a");
		var date = moment().format("MMMM Do YYYY");
		var today = moment().format("dddd");
		this._getWeatherToday();
		var weatherOne = "WeatherOne";
		var weatherTwo = "WeatherTwo";
		var weatherThree = "WeatherThree";
		var weatherFour = "WeatherFour";
		var weatherFive = "WeatherFive";
		this.setState({
			time: time,
			lat: lat,
			long: long,
			date: date,
			today: today,
			weatherToday: weatherResults,
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