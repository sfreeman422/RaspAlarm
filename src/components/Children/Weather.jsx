import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WeatherPerDay from './WeatherPerDay';

const mapStateToProps = state => ({
  weatherArr: state.weatherArr,
});
const ConnectedWeather = ({ weatherArr }) => (
  <div className="allWeather">
    {weatherArr.map((weatherItem, index) => (<WeatherPerDay
      key={`weather-${index}`}
      weatherItem={weatherItem}
      up={index > 0 ? weatherItem.temp > weatherArr[index - 1].temp : undefined}
    />))}
  </div>
);

ConnectedWeather.propTypes = {
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
};
const Weather = connect(mapStateToProps)(ConnectedWeather);
export default Weather;
