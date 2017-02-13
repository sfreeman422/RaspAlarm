var React = require('react');
var moment = require('moment');
//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");
var Alarm = require("./Children/Alarm.js");
var AlarmManager = require("./AlarmManager.js");

var hasWeatherData = false; 
var weatherInterval;
var timeInterval;

var Main = React.createClass({
	getInitialState: function(){
		return{
			time: "Loading...",
			date: "Loading...",
			today: "Loading...",
			userLoc: "Loading...",
			nextAlarm: "No alarm set",
			alarm: undefined,
			weatherToday: "Loading...",
			weatherTodayTime: "Loading...",
			weatherTodayTemp: "Loading...",
			weatherTodayPic: undefined,
			weatherHourOne: "Loading...", 
			weatherHourOneTime: "Loading...",
			weatherHourOneTemp: "Loading...",
			weatherHourOnePic: undefined,
			weatherHourTwo: "Loading...",
			weatherHourTwoTime: "Loading...",
			weatherHourTwoTemp: "Loading...",
			weatherHourTwoPic: undefined,
			weatherHourThree: "Loading...",
			weatherHourThreeTime: "Loading...",
			weatherHourThreeTemp: "Loading...",
			weatherHourThreePic: undefined,
			weatherHourFour: "Loading...",
			weatherHourFourTime: "Loading...",
			weatherHourFourTemp: "Loading...",
			weatherHourFourPic: undefined,
			weatherHourFive: "Loading...",
			weatherHourFiveTime: "Loading...",
			weatherHourFiveTemp: "Loading...",
			weatherHourFivePic: undefined
		};
	},
	//Gets the time for the alarm clock. 
	_getTime: function(){
		this.setState({
			time: moment().format("hh:mm"+"a"),
			date: moment().format("MMMM Do YYYY"),
			today: moment().format("dddd")
		});
	},
	_getLocation: function(){
		return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						console.log(position);
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
	},
	_locationThenWeather: function(){
		var that = this; 
			var currentMinute = moment().format("mm");
			console.log(currentMinute);
			//If the current time isnt an o'clock or if weather data isnt already included, we run the code to get location and get the weather forecast. 
			if(currentMinute == "00" || hasWeatherData == false){
				console.log("Getting weather data...");
				return new Promise((resolve, reject) => {
					return this._getLocation().then((locationObject) => {
						if (!locationObject) {
							const error = "Location was undefined!";
							return reject(error);
						}
						// Makes the API call to weatherunderground, then assigns forecast, time and weather icon data to the corresponding states. 
						$.ajax({
							url: "http://api.wunderground.com/api/0f21d9f3506b237b/hourly/q/"+locationObject.lat+","+locationObject.long+".json"
							}).done((response) =>{
								console.log(response);
								this.setState({
									weatherToday: response.hourly_forecast[0].condition,
									weatherTodayTime: response.hourly_forecast[0].FCTTIME.civil,
									weatherTodayTemp: response.hourly_forecast[0].temp.english+"F",
									weatherTodayPic: response.hourly_forecast[0].icon,
									weatherHourOne: response.hourly_forecast[1].condition,
									weatherHourOneTime: response.hourly_forecast[1].FCTTIME.civil,
									weatherHourOneTemp: response.hourly_forecast[1].temp.english+"F",
									weatherHourOnePic: response.hourly_forecast[1].icon,
									weatherHourTwo: response.hourly_forecast[2].condition,
									weatherHourTwoTime: response.hourly_forecast[2].FCTTIME.civil,
									weatherHourTwoTemp: response.hourly_forecast[2].temp.english+"F",
									weatherHourTwoPic: response.hourly_forecast[2].icon,
									weatherHourThree: response.hourly_forecast[3].condition,
									weatherHourThreeTime: response.hourly_forecast[3].FCTTIME.civil,
									weatherHourThreeTemp: response.hourly_forecast[3].temp.english+"F",
									weatherHourThreePic: response.hourly_forecast[3].icon,
									weatherHourFour: response.hourly_forecast[4].condition,
									weatherHourFourTime: response.hourly_forecast[4].FCTTIME.civil,
									weatherHourFourTemp: response.hourly_forecast[4].temp.english+"F",
									weatherHourFourPic: response.hourly_forecast[4].icon,
									weatherHourFive: response.hourly_forecast[5].condition,
									weatherHourFiveTime: response.hourly_forecast[5].FCTTIME.civil,
									weatherHourFiveTemp: response.hourly_forecast[1].temp.english+"F",
									weatherHourFivePic: response.hourly_forecast[5].icon,
								});
							});
						hasWeatherData = true;
						//Gets the location from the reverse geocode api provided by Google. This enables us to show the actual name of the location that the user is in. 
						$.ajax({
							url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+locationObject.lat+","+locationObject.long+"&sensor=true"
						}).done((geoloc) =>{
							console.log("Response from Google Geocode:"+geoloc);
							console.log(geoloc);
							this.setState({
								userLoc: geoloc.results[0].address_components[2].short_name+", "+ geoloc.results[0].address_components[4].short_name
							});
						});
						//Gets a list of the already set alarms. 
						$.ajax({
							url: "/alarms"
						}).done((alarms) =>{
							//Check if there are no alarms set (the array would be 0)
							if(alarms.length == 0){
								console.log("No Alarms set!");
							}
							//Else we will log out the alarms that we have. 
							else{
								console.log("Alarms are: ");
								for(var i = 0; i < alarms.length; i++){
									console.log(alarms[i]);
								}
								this.setState({
									nextAlarm: "Next alarm at "+alarms[0].time,
									alarm: alarms[0].time
								});
							}
						})
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
		},
	componentWillMount: function(){
		this._locationThenWeather();
		this._getTime();
		//Runs the locationThenWeather function every 60 seconds. We do this to avoid 6 API calls within the one minute in which we are at a :00 time. 
		weatherInterval = setInterval(this._locationThenWeather, 60000);
		//Get the time every 1/10 of a second, this will also setState for time to the current time. 
		timeInterval = setInterval(this._getTime, 100);
	},
	componentWillUnmount: function(){
		clearInterval(weatherInterval);
		clearInterval(timeInterval);
		hasWeatherData = false; 
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
					<Weather today={this.state.weatherToday} todayHour={this.state.weatherTodayTime} todayPic = {this.state.weatherTodayPic} todayTemp={this.state.weatherTodayTemp} one={this.state.weatherHourOne} oneHour={this.state.weatherHourOneTime} oneTemp={this.state.weatherHourOneTemp} onePic={this.state.weatherHourOnePic} two={this.state.weatherHourTwo} twoHour={this.state.weatherHourTwoTime} twoTemp={this.state.weatherHourTwoTemp} twoPic={this.state.weatherHourTwoPic} three={this.state.weatherHourThree} threeHour={this.state.weatherHourThreeTime} threeTemp={this.state.weatherHourThreeTemp} threePic={this.state.weatherHourThreePic} four={this.state.weatherHourFour} fourHour={this.state.weatherHourFourTime} fourTemp={this.state.weatherHourFourTemp} fourPic={this.state.weatherHourFourPic} five={this.state.weatherHourFive} fiveHour={this.state.weatherHourFiveTime} fiveTemp={this.state.weatherHourFiveTemp} fivePic={this.state.weatherHourFivePic} currentTime={this.state.time}/>
				</div>
				<div className="row">
					<Alarm nextAlarm={this.state.nextAlarm} currentTime={this.state.time}/>
				</div>
			</div>);
	}
});

module.exports = Main; 