import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import WeatherPerDay from "./WeatherPerDay";

const mapStateToProps = state => ({
  weatherArr: state.weatherArr,
  showDeltas: state.showDeltas,
  celcius: state.celcius,
  lastTemperature: state.lastTemperature
});

const ConnectedWeather = ({
  weatherArr,
  showDeltas,
  celcius,
  lastTemperature
}) => (
  <div className="allWeather">
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
        celcius={celcius}
      />
    ))}
  </div>
);

ConnectedWeather.propTypes = {
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  showDeltas: PropTypes.bool.isRequired,
  celcius: PropTypes.bool.isRequired,
  lastTemperature: PropTypes.number
};

ConnectedWeather.defaultProps = {
  lastTemperature: undefined
};

const Weather = connect(mapStateToProps)(ConnectedWeather);

export default Weather;
