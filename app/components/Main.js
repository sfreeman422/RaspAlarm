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
var keys = require("../../private/keys.js");

//Vars to save state. 
var timeSave="Loading...";
var dateSave="Loading...";
var todaySave="Loading...";
var userLocSave="Loading...";
var nextAlarmSave="Loading...";
var alarmSave="Loading...";
var weatherTodaySave="Loading...";
var weatherTodayTimeSave="Loading...";
var weatherTodayTempSave="Loading...";
var weatherTodayPicSave=undefined;
var weatherHourOneSave="Loading...";
var weatherHourOneTimeSave="Loading...";
var weatherHourOneTempSave="Loading...";
var weatherHourOnePicSave=undefined;
var weatherHourTwoSave="Loading...";
var weatherHourTwoTimeSave="Loading...";
var weatherHourTwoTempSave="Loading...";
var weatherHourTwoPicSave=undefined;
var weatherHourThreeSave="Loading...";
var weatherHourThreeTimeSave="Loading...";
var weatherHourThreeTempSave="Loading...";
var weatherHourThreePicSave=undefined;
var weatherHourFourSave="Loading...";
var weatherHourFourTimeSave="Loading...";
var weatherHourFourTempSave="Loading...";
var weatherHourFourPicSave=undefined;
var weatherHourFiveSave="Loading...";
var weatherHourFiveTimeSave="Loading...";
var weatherHourFiveTempSave="Loading...";
var weatherHourFivePicSave=undefined;
var sunriseSave=undefined;
var sunsetSave=undefined;


var Main = React.createClass({
	getInitialState: function(){
		return{
			time: timeSave,
			date: dateSave,
			today: todaySave,
			userLoc: userLocSave,
			nextAlarm: nextAlarmSave,
			alarm: alarmSave,
			weatherToday: weatherTodaySave,
			weatherTodayTime: weatherTodayTimeSave,
			weatherTodayTemp: weatherTodayTempSave,
			weatherTodayPic: weatherTodayPicSave,
			weatherHourOne: weatherHourOneSave, 
			weatherHourOneTime: weatherHourOneTimeSave,
			weatherHourOneTemp: weatherHourOneTempSave,
			weatherHourOnePic: weatherHourOnePicSave,
			weatherHourTwo: weatherHourTwoSave,
			weatherHourTwoTime: weatherHourTwoTimeSave,
			weatherHourTwoTemp: weatherHourTwoTempSave,
			weatherHourTwoPic: weatherHourTwoPicSave,
			weatherHourThree: weatherHourThreeSave,
			weatherHourThreeTime: weatherHourThreeTimeSave,
			weatherHourThreeTemp: weatherHourThreeTempSave,
			weatherHourThreePic: weatherHourThreePicSave,
			weatherHourFour: weatherHourFourSave,
			weatherHourFourTime: weatherHourFourTimeSave,
			weatherHourFourTemp: weatherHourFourTempSave,
			weatherHourFourPic: weatherHourFourPicSave,
			weatherHourFive: weatherHourFiveSave,
			weatherHourFiveTime: weatherHourFiveTimeSave,
			weatherHourFiveTemp: weatherHourFiveTempSave,
			weatherHourFivePic: weatherHourFivePicSave,
			sunrise: sunriseSave,
			sunset: sunsetSave
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
			//If the current time isnt an o'clock or if weather data isnt already included, we run the code to get location and get the weather forecast. 
			if(currentMinute == "00" || hasWeatherData == false){
				return new Promise((resolve, reject) => {
					return this._getLocation().then((locationObject) => {
						if (!locationObject) {
							const error = "Location was undefined!";
							return reject(error);
						}
						// Makes the API call to weatherunderground, then assigns forecast, time and weather icon data to the corresponding states. 
						$.ajax({
							url: "http://api.wunderground.com/api/"+keys+"/hourly/q/"+locationObject.lat+","+locationObject.long+".json"
							}).done((response) =>{
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
							this.setState({
								userLoc: geoloc.results[0].address_components[2].short_name+", "+ geoloc.results[0].address_components[4].short_name
							});
						});
						//Get the sunrise/sunset data
						$.ajax({
							url:"http://api.wunderground.com/api/"+keys+"/astronomy/q/"+locationObject.lat+","+locationObject.long+".json"
						}).done((sundata)=>{
							var sunriseString = "0"+sundata.sun_phase.sunrise.hour+":"+sundata.sun_phase.sunrise.minute+"am";
							var sunsetString = "0"+(sundata.sun_phase.sunset.hour-12)+":"+sundata.sun_phase.sunset.minute+"pm";
							var sunriseMoment = moment(sunriseString, "hh:mm:a");
							var sunsetMoment = moment(sunsetString, "hh:mm:a");
							this.setState({
								sunrise: sunriseMoment,
								sunset: sunsetMoment
							});
						})
						return resolve(locationObject);
					})
					.catch((error) => {
						return reject(error);
					});
				});
			}
		},
	componentDidMount: function(){
		this._locationThenWeather();
		this._getTime();
		//Runs the locationThenWeather function every 60 seconds. We do this to avoid 6 API calls within the one minute in which we are at a :00 time. 
		weatherInterval = setInterval(this._locationThenWeather, 60000);
		//Get the time every 1/10 of a second, this will also setState for time to the current time. 
		timeInterval = setInterval(this._getTime, 100);
	},
	componentWillUnmount: function(){
		timeSave=this.state.time;
		dateSave=this.state.date;
		todaySave=this.state.today;
		userLocSave=this.state.userLoc;
		nextAlarmSave=this.state.nextAlarm;
		alarmSave=this.state.alarm;
		weatherTodaySave=this.state.weatherToday;
		weatherTodayTimeSave=this.state.weatherTodayTime;
		weatherTodayTempSave=this.state.weatherTodayTemp;
		weatherTodayPicSave=this.state.weatherTodayPic;
		weatherHourOneSave=this.state.weatherHourOne;
		weatherHourOneTimeSave=this.state.weatherHourOneTime;
		weatherHourOneTempSave=this.state.weatherHourOneTemp;
		weatherHourOnePicSave=this.state.weatherHourOnePic;
		weatherHourTwoSave=this.state.weatherHourTwo;
		weatherHourTwoTimeSave=this.state.weatherHourTwoTime;
		weatherHourTwoTempSave=this.state.weatherHourTwoTemp;
		weatherHourTwoPicSave=this.state.weatherHourTwoPic;
		weatherHourThreeSave=this.state.weatherHourThree;
		weatherHourThreeTimeSave=this.state.weatherHourThreeTime;
		weatherHourThreeTempSave=this.state.weatherHourThreeTemp;
		weatherHourThreePicSave=this.state.weatherHourThreePic;
		weatherHourFourSave=this.state.weatherHourFour;
		weatherHourFourTimeSave=this.state.weatherHourFourTime;
		weatherHourFourTempSave=this.state.weatherHourFourTemp;
		weatherHourFourPicSave=this.state.weatherHourFourPic;
		weatherHourFiveSave=this.state.weatherHourFive;
		weatherHourFiveTimeSave=this.state.weatherHourFiveTime;
		weatherHourFiveTempSave=this.state.weatherHourFiveTemp;
		weatherHourFivePicSave=this.state.weatherHourFivePic;
		sunsetSave=this.state.sunset;
		sunriseSave=this.state.sunrise;
		clearInterval(weatherInterval);
		clearInterval(timeInterval);
		//hasWeatherData = false; 
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
					<Weather currentTime={this.state.time} today={this.state.weatherToday} todayHour={this.state.weatherTodayTime} todayPic = {this.state.weatherTodayPic} todayTemp={this.state.weatherTodayTemp} one={this.state.weatherHourOne} oneHour={this.state.weatherHourOneTime} oneTemp={this.state.weatherHourOneTemp} onePic={this.state.weatherHourOnePic} two={this.state.weatherHourTwo} twoHour={this.state.weatherHourTwoTime} twoTemp={this.state.weatherHourTwoTemp} twoPic={this.state.weatherHourTwoPic} three={this.state.weatherHourThree} threeHour={this.state.weatherHourThreeTime} threeTemp={this.state.weatherHourThreeTemp} threePic={this.state.weatherHourThreePic} four={this.state.weatherHourFour} fourHour={this.state.weatherHourFourTime} fourTemp={this.state.weatherHourFourTemp} fourPic={this.state.weatherHourFourPic} five={this.state.weatherHourFive} fiveHour={this.state.weatherHourFiveTime} fiveTemp={this.state.weatherHourFiveTemp} fivePic={this.state.weatherHourFivePic} currentTime={this.state.time} sunrise={this.state.sunrise} sunset={this.state.sunset}/>
				</div>
				<div className="row">
					<Alarm nextAlarm ={this.state.nextAlarm} currentTime={this.state.time}/>
				</div>
			</div>);
	}
});

module.exports = Main; 