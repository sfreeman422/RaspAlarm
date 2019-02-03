import React from "react";
import PropTypes from "prop-types";
import * as cn from "classnames";
import * as styles from "./WeatherPerDay.module.css";

const WeatherPerDay = ({
  weatherItem,
  up,
  showDeltas,
  celcius,
  ignoreUpIndicator
}) => (
  <div className={styles.weatherPerDay}>
    <i className={weatherItem.icon} />
    <p className={styles.weatherDescription}>
      {celcius
        ? weatherItem.temp.metric.display
        : weatherItem.temp.english.display}
      {showDeltas && !ignoreUpIndicator ? (
        <i className={cn("material-icons", up ? styles.up : styles.down)}>
          {up ? "arrow_upward" : "arrow_downward"}
        </i>
      ) : null}
    </p>
    <p>{weatherItem.condition}</p>
    <p>{weatherItem.time}</p>
  </div>
);

WeatherPerDay.propTypes = {
  weatherItem: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    temp: PropTypes.shape({
      english: PropTypes.shape({
        raw: PropTypes.number.isRequired,
        display: PropTypes.string.isRequired
      }),
      metric: PropTypes.shape({
        raw: PropTypes.number.isRequired,
        display: PropTypes.string.isRequired
      })
    }),
    condition: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }).isRequired,
  up: PropTypes.bool,
  showDeltas: PropTypes.bool.isRequired,
  celcius: PropTypes.bool.isRequired,
  ignoreUpIndicator: PropTypes.bool.isRequired
};

WeatherPerDay.defaultProps = {
  up: false
};

export default WeatherPerDay;
