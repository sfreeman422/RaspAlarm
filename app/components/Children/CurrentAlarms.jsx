import React from 'react';
import { Link } from 'react-router';

function displayLetterForDayOfWeek(days) {
  const dayOfWeek = {
    Monday: 'M',
    Tuesday: 'T',
    Wednesday: 'W',
    Thursday: 'Th',
    Friday: 'F',
    Saturday: 'Sat',
    Sunday: 'Sun',
  };
  let responseString = '';
  for (let i = 0; i < days.length; i += 1) {
    if (i < days.length - 1) {
      responseString += `${dayOfWeek[days[i]]} | `;
    } else {
      responseString += dayOfWeek[days[i]];
    }
  }
  return responseString;
}

const CurrentAlarms = props => (
  <div id="alarms">
    {props.alarms.map((alarm, i) => (
      <div id="alarm" key={`alarm-${i}`}>
        <h3 id="alarmTime">{alarm.time}</h3>
        <p id="alarmDay">{displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
        <h3 onClick={() => props.removeAlarm(alarm._id)}><span className="glyphicon glyphicon-trash"><Link to="/alarmManager" /></span></h3>
      </div>
    ))}
  </div>
);

export default CurrentAlarms;
