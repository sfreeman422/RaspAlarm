var React = require('react');
var moment = require('moment');

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

//Require the helper functions
var helpers = require('./utils/helpers.js');

var hasWeatherData = false; 

var Main = React.createClass({
	getInitialState: function(){
		return{
			time: undefined,
			userLoc: undefined,
			date: undefined,
			today: undefined,
			weatherToday: undefined,
			weatherTodayTime: undefined,
			weatherHourOne: undefined, 
			weatherHourOneTime: undefined,
			weatherHourTwo: undefined,
			weatherHourTwoTime: undefined,
			weatherHourThree: undefined,
			weatherHourThreeTime: undefined,
			weatherHourFour: undefined,
			weatherHourFourTime: undefined,
			weatherHourFive: undefined,
			weatherHourFiveTime: undefined
		};
	},
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
		                console.log('An error occurred:', error);
		                return reject(error);
		            }
		        );
		    });
		}

		function locationThenWeather() {
			var currentMinute = moment().format("mm");
			console.log(currentMinute);
			if(currentMinute == "00" || hasWeatherData == false){
				console.log("Getting weather data...");
				return new Promise((resolve, reject) => {
		        return getLocation()
		            .then((locationObject) => {
		                if (!locationObject) {
		                    const error = 'Location was undefined!';
		                    return reject(error);
		                }
		                // Makes the API call to weatherunderground. SHould be another promise structured simialrly to the getLocation function. This will then need to assign state and setInterval so that this refreshes. 
		                $.ajax({
		                	url: "http://api.wunderground.com/api/0f21d9f3506b237b/hourly/q/"+locationObject.lat+","+locationObject.long+".json"
							}).done(function(response){
								console.log(response);
							 that.setState({
							 	weatherToday: response.hourly_forecast[0].condition,
							 	weatherTodayTime: response.hourly_forecast[0].FCTTIME.civil,
							 	weatherHourOne: response.hourly_forecast[1].condition,
							 	weatherHourOneTime: response.hourly_forecast[1].FCTTIME.civil,
							 	weatherHourTwo: response.hourly_forecast[2].condition,
							 	weatherHourTwoTime: response.hourly_forecast[2].FCTTIME.civil,
							 	weatherHourThree: response.hourly_forecast[3].condition,
							 	weatherHourThreeTime: response.hourly_forecast[3].FCTTIME.civil,
							 	weatherHourFour: response.hourly_forecast[4].condition,
							 	weatherHourFourTime: response.hourly_forecast[4].FCTTIME.civil,
							 	weatherHourFive: response.hourly_forecast[5].condition,
							 	weatherHourFiveTime: response.hourly_forecast[5].FCTTIME.civil
							 });
						});
						hasWeatherData = true; 
		                return resolve(locationObject);
		            })
		            .catch((error) => {
		                //do stuff to handle error
		                return reject(error);
		            })
		   		});
			}
			else{
				console.log("No need for new weather...");
			}
		    
		}
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
					<Weather today={this.state.weatherToday} todayHour={this.state.weatherTodayTime} one={this.state.weatherHourOne} oneHour={this.state.weatherHourOneTime} two={this.state.weatherHourTwo} twoHour={this.state.weatherHourTwoTime} three={this.state.weatherHourThree} threeHour={this.state.weatherHourThreeTime} four={this.state.weatherHourFour} fourHour={this.state.weatherHourFourTime} five={this.state.weatherHourFive} fiveHour={this.state.weatherHourFiveTime}/>
				</div>
			</div>);
	}
});

module.exports = Main; 