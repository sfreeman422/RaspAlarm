var React = require('react');

var Weather = React.createClass({
	_determineWeatherIcon: function(weatherProp){
		if(weatherProp == "chanceflurries"){
			return "wi wi-day-snow"
		}
		else if(weatherProp == "chancerain"){
			return "wi wi-day-rain";
		}
		else if(weatherProp == "chancesleet"){
			return "wi wi-day-sleet";
		}
		else if(weatherProp == "chancesnow"){
			return "wi wi-day-snow";
		}
		else if(weatherProp == "chancestorms"){
			return "wi wi-day-sprinkle";
		}
		else if(weatherProp == "clear"){
			return "wi wi-day-clear";
		}
		else if(weatherProp == "cloudy"){
			return "wi wi-cloudy";
		}
		else if(weatherProp == "flurries"){
			return "wi wi-day-snow";
		}
		else if(weatherProp == "fog"){
			return "wi wi-day-fog";
		}
		else if(weatherProp == "hazy"){
			return "wi wi-day-haze";
		}
		else if(weatherProp == "mostlycloudy"){
			return "wi wi-cloud";
		}
		else if(weatherProp == "mostlysunny"){
			return "wi wi-day-sunny-overcast";
		}
		else if(weatherProp == "partlycloudy"){
			return "wi wi-day-cloudy";
		}
		else if(weatherProp == "partlysunny"){
			return "wi wi-day-sunny-overcast";
		}
		else if(weatherProp == "sleet"){
			return "wi wi-day-sleet";
		}
		else if(weatherProp == "rain"){
			return "wi wi-day-rain";
		}
		else if(weatherProp == "snow"){
			return "wi wi-day-snow";
		}
		else if(weatherProp == "sunny"){
			return "wi wi-day-sunny";
		}
		else if(weatherProp == "tstorms"){
			return "wi wi-day-storm-showers";
		}
		else if(weatherProp == "unknown"){
			return "wi wi-day-cloudy-high";
		}
		else if(weatherProp == "cloudy"){
			return "wi wi-day-cloudy";
		}
		else if(weatherProp == "partlycloudy"){
			return "wi wi-day";
		}
	},
	render: function(){
		return(
			<div className="col-xs-12 allWeather">
				<div className="col-xs-2 weatherProp">
					<i className={this._determineWeatherIcon(this.props.todayPic)}></i>
					<div className="weatherDescription">
						<p>{this.props.today}</p>
						<p>{this.props.todayTemp}</p>
						<p>{this.props.todayHour}</p>
					</div>
				</div>
				<div className="col-xs-2 weatherOne">
					<i className={this._determineWeatherIcon(this.props.onePic)}></i>
					<div className="weatherDescription">
						<p>{this.props.one}</p>
						<p>{this.props.oneTemp}</p>
						<p>{this.props.oneHour}</p>
					</div>
				</div>
				<div className="col-xs-2 weatherTwo">
					<i className={this._determineWeatherIcon(this.props.twoPic)}></i>
					<div className="weatherDescription">
						<p>{this.props.two}</p>
						<p>{this.props.twoTemp}</p>
						<p>{this.props.twoHour}</p>
					</div>
				</div>
				<div className="col-xs-2 weatherThree">
					<i className={this._determineWeatherIcon(this.props.threePic)}></i>
					<div className="weatherDescription">
						<p>{this.props.three}</p>
						<p>{this.props.threeTemp}</p>
						<p>{this.props.threeHour}</p>
					</div>
				</div>
				<div className="col-xs-2 weatherFour">
					<i className={this._determineWeatherIcon(this.props.fourPic)}></i>
					<div className="weatherDescription">
						<p>{this.props.four}</p>
						<p>{this.props.fourTemp}</p>
						<p>{this.props.fourHour}</p>
					</div>
				</div>
				<div className="col-xs-2 weatherFive">
					<i className={this._determineWeatherIcon(this.props.fivePic)}></i>
					<div className="weatherDescription">
						<p>{this.props.five}</p>
						<p>{this.props.fiveTemp}</p>
						<p>{this.props.fiveHour}</p>
					</div>
				</div>
			</div>
		)
	}
})

module.exports = Weather; 