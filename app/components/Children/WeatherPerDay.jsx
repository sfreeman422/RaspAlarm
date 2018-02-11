import React from 'react';

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

export default WeatherPerDay;
