import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { adjustTime, adjustDate, adjustToday, adjustWeather, adjustUserLoc, adjustSunData, reportError } from './actions/actions';
// Require the children
import Clock from './components/Children/Clock';
import Today from './components/Children/Today';
import Weather from './components/Children/Weather';
import Alarm from './components/Children/Alarm';
import Loading from './components/Children/Loading';

import weatherIcons from './components/weatherIcons.json';

const config = require('./private/config.json');

let hasWeatherData = false;
let weatherInterval;
let timeInterval;

const mapDispatchToProps = dispatch => ({
  adjustTime: time => dispatch(adjustTime(time)),
  adjustDate: date => dispatch(adjustDate(date)),
  adjustToday: today => dispatch(adjustToday(today)),
  adjustWeather: weatherArr => dispatch(adjustWeather(weatherArr)),
  adjustUserLoc: userLoc => dispatch(adjustUserLoc(userLoc)),
  adjustSunData: sunData => dispatch(adjustSunData(sunData)),
  reportError: error => dispatch(reportError(error)),
});
const mapStateToProps = state => ({
  time: state.time,
  date: state.date,
  today: state.today,
  sunset: state.sunset,
  sunrise: state.sunrise,
  userLoc: state.userLoc,
  weatherArr: state.weatherArr,
});
class ConnectedMain extends React.Component {
  constructor(props) {
    super(props);
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
    // this.adjustBrightness();
  }
  componentWillUnmount() {
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }
  // Gets the time for the alarm clock.
  getTime() {
    if (this.props.time !== moment().format('hh:mm' + 'a')) {
      const time = moment().format('hh:mm' + 'a');
      this.props.adjustTime(time);
    }
    if (this.props.date !== moment().format('MMMM Do YYYY')) {
      const date = moment().format('MMMM Do YYYY');
      this.props.adjustDate(date);
    }
    if (this.props.today !== moment().format('dddd')) {
      const today = moment().format('dddd');
      this.props.adjustToday(today);
    }
    // Need to work with this. Currently semi-broken anyway.
    // if (props.time === props.sunset) {
    //   isNight = true;
    //   this.adjustBrightness();
    // }
    // if (this.state.time === this.state.sunrise) {
    //   isNight = false;
    //   this.adjustBrightness();
    // }
    // if (isNight !== oldIsNight && isNight !== undefined) {
    //   this.adjustBrightness();
    // }
  }
  getLocation() {
    return new Promise((resolve, reject) => {
      console.log('trying to get location');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
          return resolve(location);
        },
        error => {
          reject(error)
        },
        { timeout: 10000 }
      );
    });
  }
  locationThenWeather() {
    const currentMinute = moment().format('mm');
    if (currentMinute === '00' || hasWeatherData === false) {
      this.getLocation()
        .then((locationObject) => {
          console.log('Location resolved');
          // Gets our weather from the weather undergound.
          fetch(`https://api.wunderground.com/api/${config.wunderground}/hourly/q/${locationObject.lat},${locationObject.long}.json`)
            .then(response => response.json())
            .then((json) => {
              const weatherArr = [];
              // Builds out an array to list weather information.
              for (let i = 0; i < 5; i += 1) {
                weatherArr.push({
                  condition: json.hourly_forecast[i].condition,
                  time: json.hourly_forecast[i].FCTTIME.civil,
                  temp: `${json.hourly_forecast[i].temp.english}F`,
                  icon: this.determineWeatherIcon(
                    json.hourly_forecast[i].icon,
                    json.hourly_forecast[i].FCTTIME.civil,
                  ),
                });
              }
              this.props.adjustWeather(weatherArr);
              hasWeatherData = true;
            })
            .catch(err => err);
          // Gets the location from the reverse geocode api provided by Google.
          // This enables us to show the actual name of the location that the user is in.
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true`)
            .then(response => response.json())
            .then((geoloc) => {
              console.log(geoloc);
              this.props.adjustUserLoc(`${geoloc.results[0].address_components[2].short_name}, ${geoloc.results[0].address_components[4].short_name}`);
            });
          // Get the sunrise/sunset data
          fetch(`https://api.wunderground.com/api/${config.wunderground}/astronomy/q/${locationObject.lat},${locationObject.long}.json`)
            .then(response => response.json())
            .then((sundata) => {
              const sunriseString = `0${sundata.sun_phase.sunrise.hour}:${sundata.sun_phase.sunrise.minute}am`;
              const sunsetString = `0${sundata.sun_phase.sunset.hour - 12}:${sundata.sun_phase.sunset.minute}pm`;
              const sunriseMoment = moment(sunriseString, 'hh:mm:a');
              const sunsetMoment = moment(sunsetString, 'hh:mm:a');
              const sunObject = {
                sunrise: sunriseMoment,
                sunset: sunsetMoment,
              };
              this.props.adjustSunData(sunObject);
            });
        })
        .catch(error =>
          this.props.reportError(`Geolocation failed! \n ${error.message}`));
    }
  }
  adjustBrightness() {
    const isNight = this.props.isNight;
    fetch('/brightness', {
      method: 'POST',
      body: {
        isNight,
      },
    })
      .then(res => res.json())
      .then(resp => console.log(resp))
      .catch(e => console.log(e));
  }
  determineWeatherIcon(weatherState, hour) {
    const sunrise = moment(this.props.sunrise, 'hh:mm:a');
    const sunset = moment(this.props.sunset, 'hh:mm:a');
    const isHour = moment(hour, 'hh:mm:a');
    let isHourNight;
    if (isHour.isAfter(sunset) || isHour.isBefore(sunrise)) {
      isHourNight = true;
    } else {
      isHourNight = false;
    }
    if (isHourNight) {
      return weatherIcons[weatherState].night;
    }
    return weatherIcons[weatherState].day;
  }
  render() {
    console.log(this.props);
    return (
      <div className="container">
        <Clock />
        <Today />
        {this.props.weatherArr && this.props.weatherArr.length > 0 ?
          <Weather /> : <Loading />}
        <Alarm />
      </div>
    );
  }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(ConnectedMain);

export default Main;
