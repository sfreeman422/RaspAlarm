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
			weatherHourOne: undefined, 
			weatherHourTwo: undefined,
			weatherHourThree: undefined,
			weatherHourFour: undefined,
			weatherHourFive: undefined
		};
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
		});
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
		                // Makes the API call to openWeather. SHould be another promise structured simialrly to the getLocation function. This will then need to assign state and setInterval so that this refreshes. 
		                $.ajax({
		                	url: "http://api.wunderground.com/api/0f21d9f3506b237b/hourly/q/"+locationObject.lat+","+locationObject.long+".json"
							}).done(function(response){
								console.log(response);
							 that.setState({
							 	weatherToday: response.hourly_forecast[0].condition,
							 	weatherHourOne: response.hourly_forecast[1].condition,
							 	weatherHourTwo: response.hourly_forecast[2].condition,
							 	weatherHourThree: response.hourly_forecast[3].condition,
							 	weatherHourFour: response.hourly_forecast[4].condition,
							 	weatherHourFive: response.hourly_forecast[5].condition,
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
	componentDidMount: function(){

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
					<Weather today={this.state.weatherToday} one={this.state.weatherHourOne} two={this.state.weatherHourTwo} three={this.state.weatherHourThree} four={this.state.weatherHourFour} five={this.state.weatherHourFive}/>
				</div>
			</div>);
	}
});

module.exports = Main; 