var React = require('react');
var moment = require('moment');
var async = require('async')

//Require the children
var Clock = require("./Children/Clock.js");
var Today = require("./Children/Today.js");
var Weather = require("./Children/Weather.js");

//Require the helper functions
var helpers = require('./utils/helpers.js');

//Gloabal variable to will hold the weather results to updatte the state. 
var weatherResults; 
//Global variables to hold the values of our day. 
var time; 
var date;
var today;
var weatherOne;
var weatherTwo;
var weatherThree;
var weatherFour;
var weatherFive;

var locationAccessible = false; 

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
	_getTime: function(){
		this.setState({
			time: moment().format("hh:mm"+"a"),
			date: moment().format("MMMM Do YYYY"),
			today: moment().format("dddd")
		}) 
	},
	componentWillMount: function(){
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
		    return new Promise((resolve, reject) => {
		        return getLocation()
		            .then((locationObject) => {
		                if (!locationObject) {
		                    const error = 'Location was undefined!';
		                    return reject(error);
		                }
		                // Makes the API call to openWeather. SHould be another promise structured simialrly to the getLocation function. This will then need to assign state and setInterval so that this refreshes. 
		                $.ajax({
							url: "http://api.openweathermap.org/data/2.5/weather?lat="+locationObject.lat+"&lon="+locationObject.long+"&APPID=a1fdaf6002affae9c9357ffa9a25e0df"
							}).done(function(response){
							 weatherResults = response.weather[0].description;
							 console.log("This is the weather right now: "+weatherResults);
							 console.log("This is the name of the town you are in: "+response.name);
						})
		                return resolve(locationObject);
		            })
		            .catch((error) => {
		                //do stuff to handle error
		                return reject(error);
		            })
		    });
		}
		locationThenWeather();
		//Get the time every 1/10 of a second, this will also setState for time to the current time. 
		setInterval(this._getTime, 100);
		//Working off of this setState since this includes all the possible props being passed to the children. 
		this.setState({
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