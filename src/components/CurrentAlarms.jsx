import React from "react";
import PropTypes from "prop-types";
import { displayLetterForDayOfWeek } from "../utils";

const CurrentAlarms = ({ alarms, removeAlarm }) => (
  <div id="alarms">
    {alarms.map((alarm, i) => (
      <div id="alarm" key={`alarm-${i}`}>
        <h3 id="alarmTime">{alarm.time}</h3>
        <p id="alarmDay">{displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
        <i
          className="material-icons"
          id="cancelAlarm"
          onClick={() => removeAlarm(alarm._id)}
        >
          cancel
        </i>
      </div>
    ))}
  </div>
);

CurrentAlarms.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAlarm: PropTypes.func.isRequired
};
export default CurrentAlarms;
