import React from 'react';
import PropTypes from 'prop-types';

const WeatherPerDay = ({ weatherItem, up }) => (
  <div className="weatherPerDay">
    <div className="weatherIcon">
      <i className={weatherItem.icon} />
    </div>
    <div className="weatherDescription">
      <p>{weatherItem.temp} {up ? <i className="material-icons" id="up">arrow_upward</i> : <i className="material-icons" id="down">arrow_downward</i>}</p>
      <p>{weatherItem.condition}</p>
      <p>{weatherItem.time}</p>
    </div>
  </div>
);

WeatherPerDay.propTypes = {
  weatherItem: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    temp: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  up: PropTypes.bool.isRequired,
};
export default WeatherPerDay;
