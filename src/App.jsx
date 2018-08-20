/* eslint-disable class-methods-use-this, react/jsx-filename-extension */
import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from './actions/actions';
import Clock from './components/Clock';
import Today from './components/Today';
import Weather from './components/Weather';
import Alarm from './components/Alarm';
import Loading from './components/Loading';
import * as weatherIcons from './components/weatherIcons.json';

const config = require('./private/config.json');

const mapDispatchToProps = dispatch => ({
  setTime: time => dispatch(actions.setTime(time)),
  setDate: date => dispatch(actions.setDate(date)),
  setToday: today => dispatch(actions.setToday(today)),
  setNight: night => dispatch(actions.setNight(night)),
  setWeather: weatherArr => dispatch(actions.setWeather(weatherArr)),
  setUserLoc: userLoc => dispatch(actions.setUserLoc(userLoc)),
  setUserCoords: userCoords => dispatch(actions.setUserCoords(userCoords)),
  setSunData: sunData => dispatch(actions.setSunData(sunData)),
  setLoadingStatus: status => dispatch(actions.setLoadingStatus(status)),
  reportError: error => dispatch(actions.reportError(error)),
  addLocation: location => dispatch(actions.addLocation(location)),
  setLastTemperature: temperature => dispatch(actions.setLastTemperature(temperature)),
  setInitialized: initialized => dispatch(actions.setInitialized(initialized)),
});

const mapStateToProps = state => ({
  time: state.time,
  isNight: state.isNight,
  sunset: state.sunset,
  sunrise: state.sunrise,
  userLoc: state.userLoc,
  userCoords: state.userCoords,
  weatherArr: state.weatherArr,
  coloredIcons: state.coloredIcons,
  date: state.date,
  initialized: state.initialized,
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
    this.generateWeatherState = this.generateWeatherState.bind(this);
    this.timeInterval = undefined;
  }

  componentDidMount() {
    this.setTime();
    this.timeInterval = setInterval(this.setTime, 1000);
    if (!this.props.initialized) {
      this.initializeApp().catch(err => this.props.reportError(err.message));
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      const sunData = await this.getSunData();
      this.props.setSunData(sunData);
    } else if (this.props.time !== prevProps.time && moment().format('mm') === '00') {
      const weather = await this.getWeather();
      this.props.setWeather(weather);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  setTime() {
    this.props.setTime(moment().format('hh:mma'));
    this.props.setDate(moment().format('MMMM Do YYYY'));
    this.props.setToday(moment().format('dddd'));
    if (this.props.sunrise && this.props.sunset) {
      this.determineNightState();
    }
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
    if (this.props.weatherArr && this.props.weatherArr.length > 0) {
      this.props.setLastTemperature(this.props.weatherArr[0]);
    }
    return fetch(`https://api.wunderground.com/api/${config.wunderground}/hourly/q/${this.props.userCoords.lat},${this.props.userCoords.long}.json`)
      .then(response => response.json())
      .then(json => this.generateWeatherState(json.hourly_forecast))
      .catch(err => new Error(`Weather retrieval failed! \n ${err.message}`));
  }

  getSunData() {
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
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        isNight,
      }),
    })
      .then(res => res.json())
      .then(resp => console.log(resp))
      .catch(e => console.error(e));
  }

  generateWeatherState(weatherArr) {
    let weather = weatherArr;

    if (weather.length === 0) {
      throw new Error('Unable to retrieve weather from WeatherUnderground. Please check your API key.');
    }

    const firstWeatherHour = parseInt(weather[0].FCTTIME.hour, 10);
    console.debug('firstWeatherHour is ', firstWeatherHour);
    console.debug('currentHour is ', moment().format('H'));
    console.debug('typeof firstWeatherHour is ', typeof firstWeatherHour);
    console.debug('typeof currentHour is ', typeof parseInt(moment().format('H'), 10));
    if (firstWeatherHour === parseInt(moment().format('H'), 10)) {
      console.debug('firstWeatherHour is ', firstWeatherHour);
      console.debug('currentHour is ', moment().format('H'));
      weather = weather.slice(1, 6);
    }

    const weatherState = [];
    for (let i = 0; i < 5; i += 1) {
      weatherState.push({
        condition: weather[i].condition,
        time: weather[i].FCTTIME.civil,
        temp: {
          english: {
            raw: parseInt(weather[i].temp.english, 10),
            display: `${weather[i].temp.english}F`,
          },
          metric: {
            raw: parseInt(weather[i].temp.metric, 10),
            display: `${weather[i].temp.metric}C`,
          },
        },
        icon: this.determineWeatherIcon(
          weather[i].icon,
          weather[i].FCTTIME.civil,
        ),
      });
    }
    return weatherState;
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
    this.props.setInitialized(true);
  }

  determineNightState() {
    const sunrise = moment(this.props.sunrise, 'hh:mm:a');
    const sunset = moment(this.props.sunset, 'hh:mm:a');
    const currentTime = moment();
    if ((currentTime.isAfter(sunset) || currentTime.isBefore(sunrise)) && !this.props.isNight) {
      this.props.setNight(true);
      this.setBrightness(true);
    } else if ((currentTime.isBefore(sunset) && currentTime.isAfter(sunrise)) && (this.props.isNight || this.props.isNight === undefined)) {
      this.props.setNight(false);
      this.setBrightness(false);
    }
  }

  determineWeatherIcon(weatherState, hour) {
    const sunrise = moment(this.props.sunrise, 'hh:mm:a');
    const sunset = moment(this.props.sunset, 'hh:mm:a');
    const currentHour = moment(hour, 'hh:mm:a');
    if (currentHour.isBefore(sunrise) || currentHour.isAfter(sunset)) {
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
  setLoadingStatus: PropTypes.func.isRequired,
  setUserCoords: PropTypes.func.isRequired,
  setUserLoc: PropTypes.func.isRequired,
  setWeather: PropTypes.func.isRequired,
  setSunData: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setToday: PropTypes.func.isRequired,
  setNight: PropTypes.func.isRequired,
  setLastTemperature: PropTypes.func.isRequired,
  setInitialized: PropTypes.func.isRequired,
  reportError: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  initialized: PropTypes.bool.isRequired,
  sunset: PropTypes.object,
  sunrise: PropTypes.object,
  date: PropTypes.string.isRequired,
  isNight: PropTypes.bool,
  userCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired,
  }).isRequired,
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ConnectedMain.defaultProps = {
  sunset: {},
  sunrise: {},
  isNight: undefined,
};

const Main = connect(mapStateToProps, mapDispatchToProps)(ConnectedMain);

export default Main;
