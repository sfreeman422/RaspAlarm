import React from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";

function displayLetterForDayOfWeek(days) {
  const dayOfWeek = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "Th",
    Friday: "F",
    Saturday: "Sat",
    Sunday: "Sun"
  };
  let responseString = "";
  for (let i = 0; i < days.length; i += 1) {
    responseString +=
      i < days.length - 1 ? `${dayOfWeek[days[i]]} | ` : dayOfWeek[days[i]];
  }
  return responseString;
}

const CurrentAlarms = ({ alarms, removeAlarm }) => (
  <div id="alarms">
    {alarms.map((alarm, i) => (
      <div id="alarm" key={`alarm-${i}`}>
        <h3 id="alarmTime">{alarm.time}</h3>
        <p id="alarmDay">{displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
        <h3 onClick={() => removeAlarm(alarm._id)}>
          <span className="glyphicon glyphicon-trash">
            <Link to="/alarmManager" />
          </span>
        </h3>
      </div>
    ))}
  </div>
);

CurrentAlarms.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAlarm: PropTypes.func.isRequired
};
export default CurrentAlarms;
