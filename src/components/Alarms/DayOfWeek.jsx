import React from "react";
import PropTypes from "prop-types";
import * as styles from "./DayOfWeek.module.css";

const DayOfWeek = ({ day, abbreviation, days, chooseDay, removeDay }) => (
  <h3
    className={[
      styles.dayOfWeek,
      days.includes(day) ? styles.selected : styles.unselected
    ].join(" ")}
    onClick={() => {
      days.includes(day) ? removeDay(day) : chooseDay(day);
    }}
  >
    {abbreviation}
  </h3>
);

DayOfWeek.propTypes = {
  day: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
  chooseDay: PropTypes.func.isRequired,
  removeDay: PropTypes.func.isRequired
};
export default DayOfWeek;
