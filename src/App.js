import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from './actions/actions';
import Clock from './components/Children/Clock';
import Today from './components/Children/Today';
import Weather from './components/Children/Weather';
import Alarm from './components/Children/Alarm';
import Loading from './components/Children/Loading';
import weatherIcons from './components/weatherIcons.json';

const config = require('./private/config.json');

let weatherInterval;
let timeInterval;

const mapDispatchToProps = dispatch => ({
  adjustTime: time => dispatch(actions.adjustTime(time)),
  adjustDate: date => dispatch(actions.adjustDate(date)),
  adjustToday: today => dispatch(actions.adjustToday(today)),
  adjustNight: night => dispatch(actions.adjustNight(night)),
  adjustWeather: weatherArr => dispatch(actions.adjustWeather(weatherArr)),
  adjustUserLoc: userLoc => dispatch(actions.adjustUserLoc(userLoc)),
  adjustUserCoords: userCoords => dispatch(actions.adjustUserCoords(userCoords)),
  adjustSunData: sunData => dispatch(actions.adjustSunData(sunData)),
  adjustWeatherStatus: status => dispatch(actions.adjustWeatherStatus(status)),
  adjustLoadingStatus: status => dispatch(actions.adjustLoadingStatus(status)),
  reportError: error => dispatch(actions.reportError(error)),
});

const mapStateToProps = state => ({
  time: state.time,
  date: state.date,
  today: state.today,
  isNight: state.isNight,
  sunset: state.sunset,
  sunrise: state.sunrise,
  userLoc: state.userLoc,
  userCoords: state.userCoords,
  hasWeatherData: state.hasWeatherData,
  weatherArr: state.weatherArr,
});

class ConnectedMain extends React.Component {
  constructor(props) {
    super(props);
    this.getTime = this.getTime.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.refineLocation = this.refineLocation.bind(this);
    this.determineWeatherIcon = this.determineWeatherIcon.bind(this);
    this.adjustBrightness = this.adjustBrightness.bind(this);
  }
  async componentDidMount() {
    this.getTime();
    timeInterval = setInterval(this.getTime, 100);
    // This is practically callback hell, what can we do here?
    this.props.adjustLoadingStatus('Getting Location...');
    const userLoc = await this.getLocation().catch(err => err);
    if (userLoc instanceof Error) {
      this.props.reportError(`Geolocation failed! \n ${userLoc.message}`);
    } else {
      this.props.adjustLoadingStatus('Refining Location...');
      this.props.adjustUserCoords(userLoc);
      const refinedLoc = await this.refineLocation(userLoc).catch(err => err);
      if (refinedLoc instanceof Error) {
        this.props.reportError(`Location Refinement Failed! \n ${refinedLoc.message}`);
      } else {
        this.props.adjustLoadingStatus('Getting Weather...');
        this.props.adjustUserLoc(refinedLoc);
        const weather = await this.getWeather().catch(err => err);
        if (weather instanceof Error) {
          this.props.reportError(`Error Getting Weather: ${weather.message}`);
        } else {
          this.props.adjustWeather(weather);
          // Runs the locationThenWeather function every 60 seconds.
          weatherInterval = setInterval(this.getWeather, 60000);
          if (this.props.hasWeatherData === false) {
            this.props.adjustWeatherStatus(true);
          }
          const sunData = await this.getSunData().catch(err => err);
          this.props.adjustSunData(sunData);
          this.props.adjustLoadingStatus('Done!');
        }
      }
    }
    // this.adjustBrightness();
  }
  componentWillUnmount() {
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }

  // Gets the time for the alarm clock.
  getTime() {
    if (this.props.time !== moment().format('hh:mma')) {
      const time = moment().format('hh:mma');
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
    // If time is equal to sunset, set to night.
    // If time is after sunset and before sunrise, set to night.
    // Only set to night if our isNight changes.

    const time = moment(this.props.time, 'hh:mm:a');
    const sunset = moment(this.props.sunset, 'hh:mm:a');
    const sunrise = moment(this.props.sunrise, 'hh:mm:a');
    if (time === sunset ||
      (time.isAfter(sunset) && time.isBefore(sunrise))) {
      if (this.props.isNight !== true) {
        this.props.adjustNight(true);
        this.adjustBrightness(true);
      }
    }
    if (time === sunrise ||
      (time.isAfter(sunrise) && time.isBefore(sunset))) {
      if (this.props.isNight !== false) {
        this.props.adjustNight(false);
        this.adjustBrightness(false);
      }
    }
  }

  getLocation() {
    // Gets our location by coordinates using the geolocation api.
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve({ lat: position.coords.latitude, long: position.coords.longitude }),
        error => reject(new Error(error.message)),
        { timeout: 30000 },
      );
    });
  }

  // Gets the weather if we are at an 'oclock' or if we do not already have weatherData.
  getWeather() {
    return new Promise((resolve, reject) => {
      const currentMinute = moment().format('mm');
      if (currentMinute === '00' || this.props.hasWeatherData === false) {
        // Gets our weather from the weather undergound.
        fetch(`https://api.wunderground.com/api/${config.wunderground}/hourly/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
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
            resolve(weatherArr);
          })
          .catch(err => reject(new Error(`Error Getting Weather: \n ${err.message}`)));
      }
    });
  }

  getSunData() {
    return new Promise((resolve, reject) => {
      // Get the sunrise/sunset data
      fetch(`https://api.wunderground.com/api/${config.wunderground}/astronomy/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
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
          resolve(sunObject);
        })
        .catch(err => reject(new Error(err.message)));
    });
  }

  refineLocation(locationObject) {
    return new Promise((resolve, reject) => {
      // Gets the location from the reverse geocode api provided by Google.
      // This enables us to show the actual name of the location that the user is in.
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true`)
        .then(response => response.json())
        .then((geoloc) => {
          if (geoloc.error_message) {
            reject(new Error(geoloc.error_message));
          }
          resolve(`${geoloc.results[0].address_components[2].short_name}, ${geoloc.results[0].address_components[4].short_name}`);
        })
        .catch(err => reject(err));
    });
  }

  adjustBrightness(isNight) {
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

ConnectedMain.propTypes = {
  adjustLoadingStatus: PropTypes.func.isRequired,
  adjustUserCoords: PropTypes.func.isRequired,
  adjustUserLoc: PropTypes.func.isRequired,
  adjustWeather: PropTypes.func.isRequired,
  adjustWeatherStatus: PropTypes.func.isRequired,
  adjustSunData: PropTypes.func.isRequired,
  adjustTime: PropTypes.func.isRequired,
  adjustDate: PropTypes.func.isRequired,
  adjustToday: PropTypes.func.isRequired,
  adjustNight: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  hasWeatherData: PropTypes.bool.isRequired,
  time: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  today: PropTypes.string.isRequired,
  sunset: PropTypes.object.isRequired,
  sunrise: PropTypes.object.isRequired,
  isNight: PropTypes.bool.isRequired,
  userCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
};
const Main = connect(mapStateToProps, mapDispatchToProps)(ConnectedMain);

export default Main;
