import React from 'react';
import PropTypes from 'prop-types';

const WeatherPerDay = props => (
  <div className="weatherPerDay">
    <div className="weatherIcon">
      <i className={props.icon} />
    </div>
    <div className="weatherDescription">
      <p>{props.temp}</p>
      <p>{props.condition}</p>
      <p>{props.time}</p>
    </div>
  </div>
);

WeatherPerDay.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.string.isRequired,
  condition: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};
export default WeatherPerDay;
