import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import WeatherPerDay from "./WeatherPerDay";
import * as styles from "./Weather.module.css";

const mapStateToProps = state => ({
  weatherArr: state.weather.weatherArr,
  showDeltas: state.userOptions.showDeltas.isEnabled,
  showCelcius: state.userOptions.showCelcius.isEnabled,
  lastTemperature: state.weather.lastTemperature
});

const ConnectedWeather = ({
  weatherArr,
  showDeltas,
  showCelcius,
  lastTemperature
}) => (
  <div className={styles.weatherContainer}>
    {weatherArr.map((weatherItem, index) => (
      <WeatherPerDay
        key={`weather-${index}`}
        weatherItem={weatherItem}
        up={
          index > 0
            ? weatherItem.temp.english.raw >
              weatherArr[index - 1].temp.english.raw
            : weatherItem.temp.english.raw > lastTemperature
        }
        showDeltas={showDeltas}
        ignoreUpIndicator={index === 0 && !lastTemperature}
        celcius={showCelcius}
      />
    ))}
  </div>
);

ConnectedWeather.propTypes = {
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  showDeltas: PropTypes.bool.isRequired,
  showCelcius: PropTypes.bool.isRequired,
  lastTemperature: PropTypes.number
};

ConnectedWeather.defaultProps = {
  lastTemperature: undefined
};

const Weather = connect(mapStateToProps)(ConnectedWeather);

export default Weather;
