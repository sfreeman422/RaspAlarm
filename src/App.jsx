/* react/jsx-filename-extension */
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as config from "./private/config";
import * as actions from "./actions/actions";
import Clock from "./components/Clock";
import Today from "./components/Today";
import Weather from "./components/Weather";
import Alarm from "./components/Alarm";
import Loading from "./components/Loading";
import weatherIcons from "./components/weatherIcons";
import {
  getUserCoordinates,
  getSunData,
  getUserCity,
  setBrightness,
  getLightRequest,
  getLightData
} from "./helpers/helpers";

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
  clearError: () => dispatch(actions.clearError()),
  addLocation: location => dispatch(actions.addLocation(location)),
  setLastTemperature: temperature =>
    dispatch(actions.setLastTemperature(temperature)),
  setInitialized: initialized => dispatch(actions.setInitialized(initialized)),
  setHueData: data => dispatch(actions.setHueData(data))
});

const mapStateToProps = state => ({
  time: state.time,
  isNight: state.isNight,
  sunData: state.sunData,
  userLoc: state.userLoc,
  userCoords: state.userCoords,
  weatherArr: state.weatherArr,
  coloredIcons: state.coloredIcons,
  date: state.date,
  initialized: state.initialized,
  today: state.today
});

const RETRY_INTERVAL = 5000;

class ConnectedMain extends React.Component {
  constructor(props) {
    super(props);
    this.setTime = this.setTime.bind(this);
    this.generateWeatherState = this.generateWeatherState.bind(this);
    this.determineNightState = this.determineNightState.bind(this);
    this.initializeApp = this.initializeApp.bind(this);
    this.runUpdate = this.runUpdate.bind(this);
    this.timeInterval = undefined;
    this.lightingInterval = undefined;
    this.errorTimeout = undefined;
  }

  componentDidMount() {
    const { initialized } = this.props;
    this.setTime();
    this.timeInterval = setInterval(this.setTime, 1000);
    if (!initialized) {
      this.initializeApp();
    }
  }

  componentDidUpdate(prevProps) {
    this.runUpdate(prevProps);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.lightingInterval);
    clearTimeout(this.errorInterval);
  }

  setTime() {
    const { setTime, setDate, setToday, sunData } = this.props;
    setTime(moment().format("hh:mma"));
    setDate(moment().format("MMMM Do YYYY"));
    setToday(moment().format("dddd"));
    if (sunData) {
      this.determineNightState();
    }
  }

  getWeather() {
    const { weatherArr, userCoords, setLastTemperature } = this.props;
    if (weatherArr && weatherArr.length > 0) {
      setLastTemperature(weatherArr[0].temp.english.raw);
    }
    return fetch(
      `https://api.wunderground.com/api/${config.wunderground}/hourly/q/${
      userCoords.lat
      },${userCoords.long}.json`
    )
      .then(response => response.json())
      .then(json => this.generateWeatherState(json.hourly_forecast))
      .catch(err => {
        throw new Error(`Weather retrieval failed! \n ${err.message}`);
      });
  }

  async runUpdate(prevProps) {
    const {
      clearError,
      date,
      initialized,
      setSunData,
      time,
      setWeather,
      reportError
    } = this.props;
    try {
      clearError();
      if (date !== prevProps.date && initialized) {
        const sunData = await getSunData();
        setSunData(sunData);
      } else if (time !== prevProps.time && moment().format("mm") === "00") {
        const weather = await this.getWeather();
        setWeather(weather);
      }
    } catch (err) {
      console.error("Error on runUpdate - ", err.message);
      this.errorTimeout = setTimeout(this.runUpdate, RETRY_INTERVAL);
      reportError(err.message);
    }
  }

  async initializeApp() {
    const {
      setLoadingStatus,
      setHueData,
      clearError,
      setUserCoords,
      setUserLoc,
      setSunData,
      setWeather,
      setInitialized,
      reportError,
      today
    } = this.props;
    try {
      if (config.hue_id && config.hue_ip) {
        setLoadingStatus("Getting Phillips Hue Data...");
        const hueData = await getLightData();
        console.log("Hue data retrieved: ", hueData);
        setHueData(hueData);
      } else {
        console.warn(
          "No hue_id or hue_ip found in config! If you wish to use this, please add these keys to your config.json"
        );
      }
      clearError();
      setLoadingStatus("Getting Location...");
      const userCoordinates = await getUserCoordinates();
      setLoadingStatus("Refining Location...");
      setUserCoords(userCoordinates);
      const userCity = await getUserCity(userCoordinates);
      setLoadingStatus("Getting Solar Information...");
      setUserLoc(userCity);
      const sunData = await getSunData(userCoordinates);
      setSunData(sunData);
      setLoadingStatus("Getting weather...");
      const weather = await this.getWeather();
      setWeather(weather);
      this.lightingInterval = setInterval(
        () => getLightRequest(sunData, today),
        30000
      );
      setInitialized(true);
    } catch (err) {
      console.error("Error on intiailizeApp - ", err.message);
      reportError(err.message);
      this.errorTimeout = setTimeout(this.initializeApp, RETRY_INTERVAL);
    }
  }

  determineNightState() {
    const { sunData, isNight, setNight } = this.props;
    const sunrise = moment(sunData.sunrise, "hh:mm:a");
    const sunset = moment(sunData.sunset, "hh:mm:a");
    const currentTime = moment();
    if (
      (currentTime.isAfter(sunset) || currentTime.isBefore(sunrise)) &&
      !isNight
    ) {
      setNight(true);
      setBrightness(true);
    } else if (
      currentTime.isBefore(sunset) &&
      currentTime.isAfter(sunrise) &&
      (isNight || isNight === undefined)
    ) {
      setNight(false);
      setBrightness(false);
    }
  }

  generateWeatherState(weatherArr) {
    let weather = weatherArr;
    const sunrise = moment(this.props.sunData.sunrise, "hh:mm:a");
    const sunset = moment(this.props.sunData.sunset, "hh:mm:a");
    const firstWeatherHour = parseFloat(weather[0].FCTTIME.hour, 10);
    if (firstWeatherHour === parseFloat(moment().format("H"), 10)) {
      weather = weather.slice(1, 6);
    }

    const weatherState = [];
    for (let i = 0; i < 5; i += 1) {
      const currentHour = moment(weather[i].FCTTIME.civil, "hh:mm:a");
      weatherState.push({
        condition: weather[i].condition,
        time: weather[i].FCTTIME.civil,
        temp: {
          english: {
            raw: parseFloat(weather[i].temp.english, 10),
            display: `${weather[i].temp.english}F`
          },
          metric: {
            raw: parseFloat(weather[i].temp.metric, 10),
            display: `${weather[i].temp.metric}C`
          }
        },
        icon:
          currentHour.isBefore(sunrise) || currentHour.isAfter(sunset)
            ? weatherIcons[weather[i].icon].night
            : weatherIcons[weather[i].icon].day
      });
    }
    return weatherState;
  }

  render() {
    const { initialized } = this.props;
    return (
      <div className="container">
        <Clock />
        <Today />
        {initialized ? <Weather /> : <Loading />}
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
  sunData: PropTypes.shape({
    sunrise: PropTypes.object,
    sunset: PropTypes.object
  }),
  clearError: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  isNight: PropTypes.bool,
  userCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    long: PropTypes.number.isRequired
  }).isRequired,
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired
};

ConnectedMain.defaultProps = {
  sunset: {},
  sunrise: {},
  isNight: undefined
};

const Main = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedMain);

export default Main;
