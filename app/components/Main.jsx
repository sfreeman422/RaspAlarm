import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';

// Require the children
import Clock from './Children/Clock.jsx';
import Today from './Children/Today.jsx';
import Weather from './Children/Weather.jsx';
import Alarm from './Children/Alarm.jsx';

let hasWeatherData = false;
let weatherInterval;
let timeInterval;
const keys = require('../../private/keys.js');

// Vars to save state.
let dateSave;
let todaySave;
let userLocSave;
let weatherArrSave = [];
let sunriseSave;
let sunsetSave;
let isNight;
let oldIsNight;

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      time: '',
      date: dateSave,
      today: todaySave,
      userLoc: userLocSave,
      weatherArr: weatherArrSave,
      sunrise: sunriseSave,
      sunset: sunsetSave,
    };
    this.getTime = this.getTime.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.locationThenWeather = this.locationThenWeather.bind(this);
    this.determineWeatherIcon = this.determineWeatherIcon.bind(this);
    this.adjustBrightness = this.adjustBrightness.bind(this);
  }
  componentDidMount() {
    this.locationThenWeather();
    this.getTime();
    // Runs the locationThenWeather function every 60 seconds.
    // We do this to avoid 6 API calls within the one minute in which we are at a :00 time.
    weatherInterval = setInterval(this.locationThenWeather, 60000);
    // Get the time every 1/10 of a second
    // This will also setState for time to the current time.
    timeInterval = setInterval(this.getTime, 100);
    this.adjustBrightness();
  }
  componentWillUnmount() {
    dateSave = this.state.date;
    todaySave = this.state.today;
    userLocSave = this.state.userLoc;
    weatherArrSave = this.state.weatherArr;
    sunsetSave = this.state.sunset;
    sunriseSave = this.state.sunrise;
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }
    // Gets the time for the alarm clock.
  getTime() {
    if (this.state.time !== moment().format('hh:mm' + 'a')) {
      this.setState({
        time: moment().format('hh:mm' + 'a'),
      });
    }
    if (this.state.date !== moment().format('MMMM Do YYYY')) {
      this.setState({
        date: moment().format('MMMM Do YYYY'),
      });
    }
    if (this.state.today !== moment().format('dddd')) {
      this.setState({
        today: moment().format('dddd'),
      });
    }
    if (this.state.time === this.state.sunset) {
      isNight = true;
      this.adjustBrightness();
    }
    if (this.state.time === this.state.sunrise) {
      isNight = false;
      this.adjustBrightness();
    }
    if (isNight !== oldIsNight && isNight !== undefined) {
      this.adjustBrightness();
    }
  }
  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        return resolve(location);
      }, error => reject(error));
    });
  }
  locationThenWeather() {
    const currentMinute = moment().format('mm');
    if (currentMinute === '00' || hasWeatherData === false) {
      this.getLocation()
      .then((locationObject) => {
        // Need to handle a lack of locationObject in the UI.
        if (!locationObject) {
          const error = 'Location was undefined!';
          console.log(error);
        }
        // Gets our weather from the weather undergound.
        fetch(`https://api.wunderground.com/api/${keys.wunderground}/hourly/q/${locationObject.lat},${locationObject.long}.json`)
          .then(response => response.json())
          .then((json) => {
            const weatherArr = [];
            // Builds out an array to list weather information.
            for (let i = 0; i < 5; i += 1) {
              weatherArr.push({
                condition: json.hourly_forecast[i].condition,
                time: json.hourly_forecast[i].FCTTIME.civil,
                temp: `${json.hourly_forecast[i].temp.english}F`,
                icon: this.determineWeatherIcon(json.hourly_forecast[i].icon, json.hourly_forecast[i].FCTTIME.civil),
              });
            }
            this.setState({
              weatherArr,
            });
            hasWeatherData = true;
          })
        .catch(err => err);
        // Gets the location from the reverse geocode api provided by Google.
        // This enables us to show the actual name of the location that the user is in.
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true`)
        .then(response => response.json())
        .then((geoloc) => {
          this.setState({
            userLoc: `${geoloc.results[0].address_components[2].short_name}, ${geoloc.results[0].address_components[4].short_name}`,
          });
        });
        // Get the sunrise/sunset data
        fetch(`https://api.wunderground.com/api/${keys.wunderground}/astronomy/q/${locationObject.lat},${locationObject.long}.json`)
        .then(response => response.json())
        .then((sundata) => {
          const sunriseString = `0${sundata.sun_phase.sunrise.hour}:${sundata.sun_phase.sunrise.minute}am`;
          const sunsetString = `0${sundata.sun_phase.sunset.hour - 12}:${sundata.sun_phase.sunset.minute}pm`;
          const sunriseMoment = moment(sunriseString, 'hh:mm:a');
          const sunsetMoment = moment(sunsetString, 'hh:mm:a');
          this.setState({
            sunrise: sunriseMoment,
            sunset: sunsetMoment,
          });
        });
      }).catch(error => reject(error));
    }
  }
  adjustBrightness() {
    if (oldIsNight !== isNight && isNight !== undefined) {
      fetch('/brightness',
        {
          method: 'POST',
          body: {
            isNight,
          },
        })
      .then(res => res.json())
      .then(resp => console.log(resp))
      .catch(e => console.log(e));
      oldIsNight = isNight;
    }
  }
  determineWeatherIcon(weatherState, hour) {
    const sunrise = moment(this.state.sunrise, 'hh:mm:a');
    const sunset = moment(this.state.sunset, 'hh:mm:a');
    const currentTime = moment(this.state.time, 'hh:mm:a');
    const isHour = moment(hour, 'hh:mm:a');
    let isHourNight;
    if ((currentTime).isAfter(sunset) || (currentTime).isBefore(sunrise)) {
      isNight = true;
    } else {
      isNight = false;
    }
    if ((isHour).isAfter(sunset) || (isHour).isBefore(sunrise)) {
      isHourNight = true;
    } else {
      isHourNight = false;
    }
    if (weatherState === 'chanceflurries') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'chancerain') {
      if (isHourNight === false) return 'wi wi-day-rain';
      return 'wi wi-night-rain';
    } else if (weatherState === 'chancesleet') {
      if (isHourNight === false) return 'wi wi-day-sleet';
      return 'wi wi-night-sleet';
    } else if (weatherState === 'chancesnow') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'chancestorms' || weatherState === 'chancetstorms') {
      if (isHourNight === false) return 'wi wi-day-sprinkle';
      return 'wi wi-night-sprinkle';
    } else if (weatherState === 'clear') {
      if (isHourNight === false) return 'wi wi-day-sunny';
      return 'wi wi-night-clear';
    } else if (weatherState === 'cloudy') {
      return 'wi wi-cloud';
    } else if (weatherState === 'flurries') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'fog') {
      if (isHourNight === false) return 'wi wi-day-fog';
      return 'wi wi-night-fog';
    } else if (weatherState === 'hazy') {
      return 'wi wi-day-haze';
    } else if (weatherState === 'mostlycloudy') {
      if (isHourNight === false) return 'wi wi-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'mostlysunny') {
      if (isHourNight === false) return 'wi wi-day-sunny-overcast';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlycloudy') {
      if (isHourNight === false) return 'wi wi-day-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlysunny') {
      if (isHourNight === false) return 'wi wi-day-sunny-overcast';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'sleet') {
      if (isHourNight === false) return 'wi wi-day-sleet';
      return 'wi wi-night-sleet';
    } else if (weatherState === 'rain') {
      if (isHourNight === false) return 'wi wi-day-rain';
      return 'wi wi-night-rain';
    } else if (weatherState === 'snow') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'sunny') {
      if (isHourNight === false) return 'wi wi-day-sunny';
      return 'wi wi-night-clear';
    } else if (weatherState === 'tstorms') {
      if (isHourNight === false) return 'wi wi-day-storm-showers';
      return 'wi wi-night-alt-storm-showers';
    } else if (weatherState === 'unknown') {
      if (isHourNight === false) return 'wi wi-day-cloudy-high';
      return 'wi wi-stars';
    } else if (weatherState === 'cloudy') {
      if (isHourNight === false) return 'wi wi-day-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlycloudy') {
      if (isHourNight === false) return 'wi wi-day';
      return 'wi wi-night-alt-cloudy';
    }
    return 'wi wi-na';
  }
  render() {
    return (
      <div className="container">
        <Clock time={this.state.time} />
        <Today date={this.state.date} userLoc={this.state.userLoc} day={this.state.today} />
        <Weather
          weatherArr={this.state.weatherArr}
          sunrise={this.state.sunrise}
          sunset={this.state.sunset}
        />
        <Alarm currentTime={this.state.time} />
      </div>);
  }
}
