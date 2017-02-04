var React = require('react');
var moment = require('moment');

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

var hasWeatherData = false; 

var Main = React.createClass({
	getInitialState: function(){
		return{
			time: undefined,
			date: undefined,
			today: undefined,
			weatherToday: undefined,
			weatherTodayTime: undefined,
			weatherTodayPic: undefined,
			weatherHourOne: undefined, 
			weatherHourOneTime: undefined,
			weatherHourOnePic: undefined,
			weatherHourTwo: undefined,
			weatherHourTwoTime: undefined,
			weatherHourTwoPic: undefined,
			weatherHourThree: undefined,
			weatherHourThreeTime: undefined,
			weatherHourThreePic: undefined,
			weatherHourFour: undefined,
			weatherHourFourTime: undefined,
			weatherHourFourPic: undefined,
			weatherHourFive: undefined,
			weatherHourFiveTime: undefined,
			weatherHourFivePic: undefined
		};
	},
	//Gets the time for the alarm clock. 
	_getTime: function(){
		this.setState({
			time: moment().format("hh:mm"+"a"),
			date: moment().format("MMMM Do YYYY"),
			today: moment().format("dddd")
		}) ;
	},
	componentWillMount: function(){
		var that = this;
		//Function to get the location of our user based on HTML5 Geolocation. 
		function getLocation() {
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const location = {
							lat: position.coords.latitude,
							long: position.coords.longitude
						};
						return resolve(location);
					},
					(error) => {
						return reject(error);
					});
			});
		}

		function locationThenWeather() {
			var currentMinute = moment().format("mm");
			console.log(currentMinute);
			//If the current time isnt an o'clock or if weather data isnt already included, we run the code to get location and get the weather forecast. 
			if(currentMinute == "00" || hasWeatherData == false){
				console.log("Getting weather data...");
				return new Promise((resolve, reject) => {
					return getLocation().then((locationObject) => {
						if (!locationObject) {
							const error = "Location was undefined!";
							return reject(error);
						}
						// Makes the API call to weatherunderground, then assigns forecast, time and weather icon data to the corresponding states. 
						$.ajax({
							url: "http://api.wunderground.com/api/0f21d9f3506b237b/hourly/q/"+locationObject.lat+","+locationObject.long+".json"
							}).done(function(response){
								console.log(response);
								that.setState({
									weatherToday: response.hourly_forecast[0].condition,
									weatherTodayTime: response.hourly_forecast[0].FCTTIME.civil,
									weatherTodayPic: response.hourly_forecast[0].icon_url,
									weatherHourOne: response.hourly_forecast[1].condition,
									weatherHourOneTime: response.hourly_forecast[1].FCTTIME.civil,
									weatherHourOnePic: response.hourly_forecast[1].icon_url,
									weatherHourTwo: response.hourly_forecast[2].condition,
									weatherHourTwoTime: response.hourly_forecast[2].FCTTIME.civil,
									weatherHourTwoPic: response.hourly_forecast[2].icon_url,
									weatherHourThree: response.hourly_forecast[3].condition,
									weatherHourThreeTime: response.hourly_forecast[3].FCTTIME.civil,
									weatherHourThreePic: response.hourly_forecast[3].icon_url,
									weatherHourFour: response.hourly_forecast[4].condition,
									weatherHourFourTime: response.hourly_forecast[4].FCTTIME.civil,
									weatherHourFourPic: response.hourly_forecast[4].icon_url,
									weatherHourFive: response.hourly_forecast[5].condition,
									weatherHourFiveTime: response.hourly_forecast[5].FCTTIME.civil,
									weatherHourFivePic: response.hourly_forecast[5].icon_url,
								});
							});
						hasWeatherData = true; 
						return resolve(locationObject);
					})
					.catch((error) => {
						return reject(error);
					});
				});
			}
			else{
				console.log("No need for new weather...");
			}
		    
		}
		//Runs the locationThenWeather function every 10 seconds. 
		setInterval(locationThenWeather(), 10000);
		//Get the time every 1/10 of a second, this will also setState for time to the current time. 
		setInterval(this._getTime, 100);
	},
	render: function(){
		return(
			<div className="container">
				<div className="row">
					<Clock time={this.state.time}/>
				</div>
				<div className="row">
					<Today date={this.state.date} userLoc={this.state.userLoc} day={this.state.today}/>
				</div>
				<div className="row">
					<Weather today={this.state.weatherToday} todayHour={this.state.weatherTodayTime} todayPic = {this.state.weatherTodayPic} one={this.state.weatherHourOne} oneHour={this.state.weatherHourOneTime} onePic={this.state.weatherHourOnePic} two={this.state.weatherHourTwo} twoHour={this.state.weatherHourTwoTime} twoPic={this.state.weatherHourTwoPic} three={this.state.weatherHourThree} threeHour={this.state.weatherHourThreeTime} threePic={this.state.weatherHourThreePic} four={this.state.weatherHourFour} fourHour={this.state.weatherHourFourTime} fourPic={this.state.weatherHourFourPic} five={this.state.weatherHourFive} fiveHour={this.state.weatherHourFiveTime} fivePic={this.state.weatherHourFivePic}/>
				</div>
			</div>);
	}
});

module.exports = Main; 