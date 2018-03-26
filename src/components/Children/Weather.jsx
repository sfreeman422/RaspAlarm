import React from 'react';
import WeatherPerDay from './WeatherPerDay.jsx';

const Weather = ({ weatherArr }) => (
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
export default Weather;
