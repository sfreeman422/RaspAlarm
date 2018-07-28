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
import * as weatherIcons from './components/weatherIcons.json';

const config = require('./private/config.json');

let weatherInterval;
let timeInterval;

const mapDispatchToProps = dispatch => ({
  setTime: time => dispatch(actions.setTime(time)),
  setDate: date => dispatch(actions.setDate(date)),
  setToday: today => dispatch(actions.setToday(today)),
  setNight: night => dispatch(actions.setNight(night)),
  setWeather: weatherArr => dispatch(actions.setWeather(weatherArr)),
  setUserLoc: userLoc => dispatch(actions.setUserLoc(userLoc)),
  setUserCoords: userCoords => dispatch(actions.setUserCoords(userCoords)),
  setSunData: sunData => dispatch(actions.setSunData(sunData)),
  setWeatherStatus: status => dispatch(actions.setWeatherStatus(status)),
  setLoadingStatus: status => dispatch(actions.setLoadingStatus(status)),
  reportError: error => dispatch(actions.reportError(error)),
  addLocation: location => dispatch(actions.addLocation(location)),
});

const mapStateToProps = state => ({
  time: state.time,
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
    this.setBrightness = this.setBrightness.bind(this);
  }

  componentDidMount() {
    this.setTime();
    timeInterval = setInterval(this.setTime, 100);
    this.initializeApp().catch(err => this.props.reportError(err.message));
  }
  componentWillUnmount() {
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }

  setTime() {
    this.props.setTime(moment().format('hh:mma'));
    this.props.setDate(moment().format('MMMM Do YYYY'));
    this.props.setToday(moment().format('dddd'));
    this.determineNightState();
  }

  getUserCoordinates() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve({ lat: position.coords.latitude, long: position.coords.longitude }),
        error => reject(new Error(`Geolocation failed! \n ${error.message}`)),
        { timeout: 30000 },
      );
    });
  }

  getWeather() {
    if ((this.props.userCoords && moment().format('mm') === '00') || !this.props.hasWeatherData) {
      return fetch(`https://api.wunderground.com/api/${config.wunderground}/hourly/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
        .then(response => response.json())
        .then((json) => {
          if (json.hourly_forecast.length === 0) {
            throw new Error('Unable to retrieve weather from WeatherUnderground. Please check your API key.');
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
          return weatherArr;
        })
        .catch(err => new Error(`Weather retrieval failed! \n ${err.message}`));
    } return this.state.weatherArr;
  }

  getSunData() {
    // Get the sunrise/sunset data
    return fetch(`https://api.wunderground.com/api/${config.wunderground}/astronomy/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
      .then(response => response.json())
      .then(sundata => ({
        sunrise: moment(`0${sundata.sun_phase.sunrise.hour}:${sundata.sun_phase.sunrise.minute}am`, 'hh:mm:a'),
        sunset: moment(`0${sundata.sun_phase.sunset.hour - 12}:${sundata.sun_phase.sunset.minute}pm`, 'hh:mm:a'),
      }))
      .catch(err => new Error(`Sunrise/sunset retrieval failed! \n ${err.message}`));
  }

  getUserCity(locationObject) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true&key=${config.google_geocode}`)
      .then(response => response.json())
      .then((geoloc) => {
        if (geoloc.error_message) {
          throw new Error(`Location Refinement Failed! \n ${geoloc.error_message}`);
        }
        return `${geoloc.results[0].address_components[2].short_name}, ${geoloc.results[0].address_components[4].short_name}`;
      })
      .catch(err => new Error(`Location Refinement Failed! \n Unknown error: ${err}`));
  }

  setBrightness(isNight) {
    fetch('/brightness', {
      method: 'POST',
      body: {
        isNight,
      },
    })
      .then(res => res.json())
      .then(resp => console.log(resp))
      .catch(e => console.error(e));
  }

  async initializeApp() {
    this.props.setLoadingStatus('Getting Location...');
    const userCoordinates = await this.getUserCoordinates();
    this.props.setLoadingStatus('Refining Location...');
    this.props.setUserCoords(userCoordinates);
    const userCity = await this.getUserCity(userCoordinates);
    this.props.setLoadingStatus('Getting Solar Information...');
    this.props.setUserLoc(userCity);
    const sunData = await this.getSunData();
    this.props.setSunData(sunData);
    this.props.setLoadingStatus('Getting weather...');
    const weather = await this.getWeather();
    this.props.setWeather(weather);
    weatherInterval = setInterval(this.getWeather(), 60000);
    this.props.setWeatherStatus(true);
    this.props.setLoadingStatus('Done!');
    this.setBrightness();
  }

  determineNightState() {
    if (moment(this.props.time, 'hh:mm:a').isBetween(
      moment(this.props.sunset, 'hh:mm:a'),
      moment(this.props.sunrise, 'hh:mm:a'),
    ) && !this.props.isNight) {
      this.props.setNight(true);
      this.setBrightness(true);
    } else if (this.props.isNight) {
      this.props.setNight(false);
      this.setBrightness(false);
    }
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
  setLoadingStatus: PropTypes.func.isRequired,
  setUserCoords: PropTypes.func.isRequired,
  setUserLoc: PropTypes.func.isRequired,
  setWeather: PropTypes.func.isRequired,
  setWeatherStatus: PropTypes.func.isRequired,
  setSunData: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setToday: PropTypes.func.isRequired,
  setNight: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  hasWeatherData: PropTypes.bool.isRequired,
  time: PropTypes.string.isRequired,
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
