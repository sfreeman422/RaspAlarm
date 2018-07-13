import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WeatherPerDay from './WeatherPerDay';

const mapStateToProps = state => ({
  weatherArr: state.weatherArr,
  showDeltas: state.showDeltas,
  celcius: state.celcius,
});

const ConnectedWeather = ({ weatherArr, showDeltas, celcius }) => (
  <div className="allWeather">
    {weatherArr.map((weatherItem, index) => (<WeatherPerDay
      key={`weather-${index}`}
      weatherItem={weatherItem}
      up={index > 0 ?
        weatherItem.temp.english.raw > weatherArr[index - 1].temp.english.raw
        : undefined}
      showDeltas={showDeltas}
      celcius={celcius}
    />))}
  </div>
);

ConnectedWeather.propTypes = {
  weatherArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  showDeltas: PropTypes.bool.isRequired,
  celcius: PropTypes.bool.isRequired,
};

const Weather = connect(mapStateToProps)(ConnectedWeather);

export default Weather;
