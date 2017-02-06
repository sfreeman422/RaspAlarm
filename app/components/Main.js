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
			userLoc: undefined,
			weatherToday: undefined,
			weatherTodayTime: undefined,
			weatherTodayTemp: undefined,
			weatherTodayPic: undefined,
			weatherHourOne: undefined, 
			weatherHourOneTime: undefined,
			weatherHourOneTemp: undefined,
			weatherHourOnePic: undefined,
			weatherHourTwo: undefined,
			weatherHourTwoTime: undefined,
			weatherHourTwoTemp: undefined,
			weatherHourTwoPic: undefined,
			weatherHourThree: undefined,
			weatherHourThreeTime: undefined,
			weatherHourThreeTemp: undefined,
			weatherHourThreePic: undefined,
			weatherHourFour: undefined,
			weatherHourFourTime: undefined,
			weatherHourFourTemp: undefined,
			weatherHourFourPic: undefined,
			weatherHourFive: undefined,
			weatherHourFiveTime: undefined,
			weatherHourFiveTemp: undefined,
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
									weatherTodayTemp: response.hourly_forecast[0].temp.english+"F",
									weatherTodayPic: response.hourly_forecast[0].icon_url,
									weatherHourOne: response.hourly_forecast[1].condition,
									weatherHourOneTime: response.hourly_forecast[1].FCTTIME.civil,
									weatherHourOneTemp: response.hourly_forecast[1].temp.english+"F",
									weatherHourOnePic: response.hourly_forecast[1].icon_url,
									weatherHourTwo: response.hourly_forecast[2].condition,
									weatherHourTwoTime: response.hourly_forecast[2].FCTTIME.civil,
									weatherHourTwoTemp: response.hourly_forecast[2].temp.english+"F",
									weatherHourTwoPic: response.hourly_forecast[2].icon_url,
									weatherHourThree: response.hourly_forecast[3].condition,
									weatherHourThreeTime: response.hourly_forecast[3].FCTTIME.civil,
									weatherHourThreeTemp: response.hourly_forecast[3].temp.english+"F",
									weatherHourThreePic: response.hourly_forecast[3].icon_url,
									weatherHourFour: response.hourly_forecast[4].condition,
									weatherHourFourTime: response.hourly_forecast[4].FCTTIME.civil,
									weatherHourFourTemp: response.hourly_forecast[4].temp.english+"F",
									weatherHourFourPic: response.hourly_forecast[4].icon_url,
									weatherHourFive: response.hourly_forecast[5].condition,
									weatherHourFiveTime: response.hourly_forecast[5].FCTTIME.civil,
									weatherHourFiveTemp: response.hourly_forecast[1].temp.english+"F",
									weatherHourFivePic: response.hourly_forecast[5].icon_url,
								});
							});
						hasWeatherData = true;
						$.ajax({
							url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+locationObject.lat+","+locationObject.long+"&sensor=true"
						}).done(function(geoloc){
							console.log("Response from Google Geocode:"+geoloc);
							console.log(geoloc);
							that.setState({
								userLoc: geoloc.results[0].address_components[2].short_name+", "+ geoloc.results[0].address_components[4].short_name
							});
						});
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
					<Weather today={this.state.weatherToday} todayHour={this.state.weatherTodayTime} todayPic = {this.state.weatherTodayPic} todayTemp={this.state.weatherTodayTemp} one={this.state.weatherHourOne} oneHour={this.state.weatherHourOneTime} oneTemp={this.state.weatherHourOneTemp} onePic={this.state.weatherHourOnePic} two={this.state.weatherHourTwo} twoHour={this.state.weatherHourTwoTime} twoTemp={this.state.weatherHourTwoTemp} twoPic={this.state.weatherHourTwoPic} three={this.state.weatherHourThree} threeHour={this.state.weatherHourThreeTime} threeTemp={this.state.weatherHourThreeTemp} threePic={this.state.weatherHourThreePic} four={this.state.weatherHourFour} fourHour={this.state.weatherHourFourTime} fourTemp={this.state.weatherHourFourTemp} fourPic={this.state.weatherHourFourPic} five={this.state.weatherHourFive} fiveHour={this.state.weatherHourFiveTime} fiveTemp={this.state.weatherHourFiveTemp} fivePic={this.state.weatherHourFivePic}/>
				</div>
			</div>);
	}
});

module.exports = Main; 