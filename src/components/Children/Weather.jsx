import React from 'react';
import { connect } from 'react-redux';
import WeatherPerDay from './WeatherPerDay.jsx';

const mapStateToProps = state => ({
  weatherArr: state.weatherArr,
});
const ConnectedWeather = ({ weatherArr }) => (
  <div className="allWeather">
    {weatherArr.map((weatherItem, index) =>
      (<WeatherPerDay
        key={`weather-${index}`}
        icon={weatherItem.icon}
        temp={weatherItem.temp}
        condition={weatherItem.condition}
        time={weatherItem.time}
      />),
    )}
  </div>
);

const Weather = connect(mapStateToProps)(ConnectedWeather);
export default Weather;
