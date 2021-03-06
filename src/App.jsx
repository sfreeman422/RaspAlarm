import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as config from "./private/config";
import * as actions from "./actions";
import Clock from "./components/Clock";
import Today from "./components/Today";
import Weather from "./components/Weather";
import Alarm from "./components/Alarm";
import Loading from "./components/Loading";
import {
  getUserCoordinates,
  getSunData,
  getUserCity,
  setBrightness,
  getLightData,
  generateWeatherState,
  changeLightingForGroups
} from "./utils";

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
  time: state.dateTime.time,
  isNight: state.dateTime.isNight,
  sunData: state.weather.sunData,
  userLoc: state.location.userLoc,
  userCoords: state.location.userCoords,
  weatherArr: state.weather.weatherArr,
  coloredIcons: state.userOptions.coloredIcons,
  date: state.dateTime.date,
  initialized: state.applicationState.initialized,
  today: state.dateTime.today,
  isPhillipsHueEnabled: state.userOptions.isPhillipsHue.isEnabled,
  hueData: state.applicationState.hueData
});

const RETRY_INTERVAL = 5000;

class ConnectedMain extends React.Component {
  constructor(props) {
    super(props);
    this.timeInterval = undefined;
    this.errorTimeout = undefined;
  }

  componentDidMount() {
    const { initialized } = this.props;
    this.setDateAndTime();
    this.timeInterval = setInterval(() => this.setDateAndTime(), 1000);
    if (!initialized) {
      this.initializeApp();
    }
  }

  componentDidUpdate(prevProps, _prevState) {
    this.runUpdate(prevProps);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearTimeout(this.errorInterval);
  }

  setDateAndTime = () => {
    const { setTime, setDate, setToday, sunData } = this.props;
    setTime(moment().format("hh:mma"));
    setDate(moment().format("MMMM Do YYYY"));
    setToday(moment().format("dddd"));
    if (sunData) {
      this.determineNightState();
    }
  };

  getWeather = userCoords => {
    const { weatherArr, setLastTemperature } = this.props;
    if (weatherArr && weatherArr.length > 0) {
      setLastTemperature(weatherArr[0].temp.english.raw);
    }
    return fetch(
      `https://api.wunderground.com/api/${config.wunderground}/hourly/q/${
        userCoords.lat
      },${userCoords.long}.json`
    )
      .then(response => response.json())
      .then(json =>
        generateWeatherState(json.hourly_forecast, this.props.sunData)
      )
      .catch(err => {
        throw new Error(`Weather retrieval failed! \n ${err.message}`);
      });
  };

  runUpdate = async prevProps => {
    const {
      clearError,
      date,
      initialized,
      setSunData,
      time,
      setWeather,
      reportError,
      isPhillipsHueEnabled,
      userCoords,
      today,
      sunData
    } = this.props;
    try {
      clearError();
      if (date !== prevProps.date && initialized) {
        const sunData = await getSunData(userCoords);
        setSunData(sunData);
      }
      if (time !== prevProps.time && moment().format("mm") === "00") {
        const weather = await this.getWeather(userCoords);
        setWeather(weather);
      }
      if (isPhillipsHueEnabled && config.hue_id && config.hue_ip) {
        changeLightingForGroups(today, sunData);
      }
    } catch (err) {
      console.error("Error on runUpdate - ", err.message);
      reportError(err.message);
    }
  };

  hueHandler = async () => {
    const {
      isPhillipsHueEnabled,
      setLoadingStatus,
      setHueData,
      sunData,
      initialized
    } = this.props;
    if (config.hue_id && config.hue_ip && isPhillipsHueEnabled) {
      initialized && setLoadingStatus("Getting Phillips Hue Data...");
      const hueData = await getLightData();
      setHueData(hueData);
      if (hueData) {
        changeLightingForGroups(sunData, this.props.today);
      }
    } else {
      console.warn(
        !isPhillipsHueEnabled && config.hue_ip && config.hue_id
          ? "Phillips Hue support is not enabled in settings. Please enable if you wish to take advantage of home automation features!"
          : "No hue_id or hue_ip found in config! If you wish to use this, please add these keys to your config.json"
      );
    }
  };

  initializeApp = async () => {
    const {
      setLoadingStatus,
      clearError,
      setUserCoords,
      setUserLoc,
      setSunData,
      setWeather,
      setInitialized,
      reportError
    } = this.props;
    try {
      this.hueHandler();
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
      const weather = await this.getWeather(userCoordinates);
      setWeather(weather);
      setInitialized(true);
    } catch (err) {
      console.error("Error on initializeApp - ", err.message);
      reportError(err.message);
      this.errorTimeout = setTimeout(
        () => this.initializeApp(),
        RETRY_INTERVAL
      );
    }
  };

  determineNightState = () => {
    const { sunData, isNight, setNight } = this.props;
    const sunrise = moment(sunData.sunrise, "hh:mm:a");
    const sunset = moment(sunData.sunset, "hh:mm:a");
    const rawTime = moment();
    const currentTime = moment(rawTime, "hh:mm:a");
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
  };

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
