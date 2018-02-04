import React from 'react';
import fetch from 'isomorphic-fetch';
import { Link } from 'react-router';

export default class CurrentAlarms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listAlarms: [],
    };
    this.getAlarms = this.getAlarms.bind(this);
    this.removeAlarm = this.removeAlarm.bind(this);
    this.displayLetterForDayOfWeek = this.displayLetterForDayOfWeek.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.alarms !== nextProps.alarms) {
      this.setState({ listAlarms: nextProps.alarms });
    }
  }
  getAlarms() {
    fetch('/alarms')
    .then(response => response.json())
    .then((alarms) => {
      this.setState({
        listAlarms: alarms,
      });
    });
  }
  removeAlarm(id) {
    console.log('should remove alarm');
    fetch('/deleteAlarm',
      {
        method: 'DELETE',
        body: JSON.stringify({
          id,
          _method: 'delete',
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      },
    ).then(() => {
      this.getAlarms();
    });
  }
  displayLetterForDayOfWeek(days) {
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
  render() {
    if (this.state.listAlarms !== undefined) {
      return (
        <div id="alarms">
          {this.state.listAlarms.map((alarm, i) => (
            <div className="col-xs-2" id="alarm" key={i}>
              <h3 id="alarmTime">{alarm.time}</h3>
              <p id="alarmDay">{this.displayLetterForDayOfWeek(alarm.dayOfWeek)}</p>
              <h3 onClick={() => this.removeAlarm(alarm._id)}><span className="glyphicon glyphicon-trash"><Link to="/alarmManager" /></span></h3>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="col-xs-12" id="alarms" />
    );
  }
}
