/* eslint-disable class-methods-use-this, react/jsx-filename-extension */
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
  addLocation: location => dispatch(actions.addLocation(location)),
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
  coloredIcons: state.coloredIcons,
});

class ConnectedMain extends React.Component {
  constructor(props) {
    super(props);
    this.setTime = this.setTime.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.getUserCoordinates = this.getUserCoordinates.bind(this);
    this.getUserCity = this.getUserCity.bind(this);
    this.determineWeatherIcon = this.determineWeatherIcon.bind(this);
    this.determineNightState = this.determineNightState.bind(this);
    this.adjustBrightness = this.adjustBrightness.bind(this);
  }

  componentDidMount() {
    this.setTime();
    timeInterval = setInterval(this.setTime, 100);
    this.initializeApp();
  }
  componentWillUnmount() {
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }

  setTime() {
    this.props.adjustTime(moment().format('hh:mma'));
    this.props.adjustDate(moment().format('MMMM Do YYYY'));
    this.props.adjustToday(moment().format('dddd'));
    this.determineNightState();
  }

  getUserCoordinates() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve({ lat: position.coords.latitude, long: position.coords.longitude }),
        error => reject(new Error(error.message)),
        { timeout: 30000 },
      );
    });
  }

  getWeather() {
    return new Promise((resolve, reject) => {
      // Gets our weather from the weather undergound.
      fetch(`https://api.wunderground.com/api/${config.wunderground}/hourly/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
        .then(response => response.json())
        .then((json) => {
          if (json.hourly_forecast.length === 0) {
            reject(new Error('Unable to retrieve weather from WeatherUnderground. Please check your API key.'));
          }
          const weatherArr = [];
          // Builds out an array to list weather information.
          for (let i = 0; i < 5; i += 1) {
            weatherArr.push({
              condition: json.hourly_forecast[i].condition,
              time: json.hourly_forecast[i].FCTTIME.civil,
              temp: {
                english: {
                  raw: parseInt(json.hourly_forecast[i].temp.english, 10),
                  display: `${json.hourly_forecast[i].temp.english}F`,
                },
                metric: {
                  raw: parseInt(json.hourly_forecast[i].temp.metric, 10),
                  display: `${json.hourly_forecast[i].temp.metric}C`,
                },
              },
              icon: this.determineWeatherIcon(
                json.hourly_forecast[i].icon,
                json.hourly_forecast[i].FCTTIME.civil,
              ),
            });
          }
          resolve(weatherArr);
        })
        .catch(err => reject(new Error(err.message)));
    });
  }

  getSunData() {
    return new Promise((resolve, reject) => {
      // Get the sunrise/sunset data
      fetch(`https://api.wunderground.com/api/${config.wunderground}/astronomy/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
        .then(response => response.json())
        .then((sundata) => {
          resolve({
            sunrise: moment(`0${sundata.sun_phase.sunrise.hour}:${sundata.sun_phase.sunrise.minute}am`, 'hh:mm:a'),
            sunset: moment(`0${sundata.sun_phase.sunset.hour - 12}:${sundata.sun_phase.sunset.minute}pm`, 'hh:mm:a'),
          });
        })
        .catch(err => reject(new Error(err.message)));
    });
  }

  getUserCity(locationObject) {
    return new Promise((resolve, reject) => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true&key=${config.google_geocode}`)
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

  determineNightState() {
    if (moment(this.props.time, 'hh:mm:a').isBetween(
      moment(this.props.sunset, 'hh:mm:a'),
      moment(this.props.sunrise, 'hh:mm:a'),
    ) && !this.props.isNight) {
      this.props.adjustNight(true);
      this.adjustBrightness(true);
    } else if (this.props.isNight) {
      this.props.adjustNight(false);
      this.adjustBrightness(false);
    }
  }

  async initializeApp() {
    this.props.adjustLoadingStatus('Getting Location...');
    const userCoordinates = await this.getUserCoordinates().catch(err => this.props.reportError(`Geolocation failed! \n ${err.message}`));
    this.props.adjustLoadingStatus('Refining Location...');
    this.props.adjustUserCoords(userCoordinates);
    const userCity = await this.getUserCity(userCoordinates).catch(err => this.props.reportError(`Location Refinement Failed! \n ${err.message}`));
    this.props.adjustLoadingStatus('Getting Solar Information...');
    this.props.adjustUserLoc(userCity);
    const sunData = await this.getSunData().catch(err => this.props.reportError(`Sunrise/sunset retrieval failed! \n ${err.message}`));
    this.props.adjustSunData(sunData);
    this.props.adjustLoadingStatus('Getting weather...');
    const weather = await this.getWeather().catch(err => this.props.reportError(`Weather retrieval failed! \n ${err.message}`));
    this.props.adjustWeather(weather);
    weatherInterval = setInterval(() => {
      if (this.props.userCoords && (moment().format('mm') === '00' || this.props.hasWeatherData === false)) {
        this.getWeather();
      }
    }, 60000);
    this.props.adjustWeatherStatus(true);
    this.props.adjustLoadingStatus('Done!');
    this.adjustBrightness();
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
    if (isHour.isAfter(sunset) || isHour.isBefore(sunrise)) {
      return weatherIcons[weatherState].night;
    } return weatherIcons[weatherState].day;
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
  date: PropTypes.object.isRequired,
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
