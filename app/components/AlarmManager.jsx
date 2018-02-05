import React from 'react';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import CurrentAlarms from './Children/CurrentAlarms.jsx';

let daysOfWeek = [];

export default class AlarmManager extends React.Component {
  constructor() {
    super();
    const now = moment();
    let minute = parseInt(now.format('mm'), 10);
    if (minute < 10 && minute > 0) {
      minute = 10;
    } else {
      minute = Math.ceil(minute / 5) * 5;
    }
    this.state = {
      hour: parseInt(now.format('h'), 10),
      minute,
      ampm: now.format('a'),
      hourDisplay: now.format('hh'),
      minuteDisplay: minute,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
      alarms: [],
    };
    this.incrementHour = this.incrementHour.bind(this);
    this.incrementMinute = this.incrementMinute.bind(this);
    this.changeAMPM = this.changeAMPM.bind(this);
    this.chooseDay = this.chooseDay.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
  }
  componentDidMount() {
    this.getAlarms();
  }
  getAlarms() {
    fetch('/alarms')
      .then(res => res.json())
      .then((alarms) => {
        console.log(alarms);
        this.setState({ alarms });
      });
  }
  incrementMinute() {
    if (this.state.minute === 55) {
      this.setState({
        minute: 0,
        minuteDisplay: '00',
      });
    } else if (this.state.minute < 10) {
      // Grab what the minute will be for the minuteDisplay
      const stringMinute = this.state.minute + 5;
      if (stringMinute === 10) {
        this.setState({
          minute: stringMinute,
          minuteDisplay: stringMinute,
        });
      } else {
        this.setState({
          minute: this.state.minute + 5,
          minuteDisplay: `0${stringMinute.toString()}`,
        });
      }
    } else {
      this.setState({
        minute: this.state.minute + 5,
        minuteDisplay: this.state.minute + 5,
      });
    }
  }
  changeAMPM() {
    if (this.state.ampm === 'am') {
      this.setState({
        ampm: 'pm',
      });
    } else {
      this.setState({
        ampm: 'am',
      });
    }
  }
  // This new logic is super concise but presents an issue with the CSS when choosing days.
  // Need to ensure that we can set a className based on the boolean in the day.
  chooseDay(day) {
    if (!this.state[day]) {
      this.setState({
        [day]: true,
      });
      daysOfWeek.push(day);
    } else {
      this.setState({
        [day]: false,
      });
      for (let i = 0; i < daysOfWeek.length; i += 1) {
        if (daysOfWeek[i] === day) {
          daysOfWeek.splice(i, 1);
        }
      }
    }
  }
  incrementHour() {
    if (this.state.hour === 12) {
      this.setState({
        hour: 1,
        hourDisplay: '01',
      });
    } else if (this.state.hour < 10) {
      // Grab what our hour will be.
      const stringHour = this.state.hour + 1;
      if (stringHour === 10) {
        this.setState({
          hour: 10,
          hourDisplay: 10,
        });
      } else {
        this.setState({
          hour: this.state.hour + 1,
          hourDisplay: `0${stringHour.toString()}`,
        });
      }
    } else {
      this.setState({
        hour: this.state.hour + 1,
        hourDisplay: this.state.hour + 1,
      });
    }
  }
  setAlarm() {
    const hour = this.state.hourDisplay;
    const minute = this.state.minuteDisplay;
    const ampm = this.state.ampm;
    const data = {
      hour,
      minute,
      ampm,
      dayOfWeek: daysOfWeek,
    };
    fetch('/setAlarm',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
      .then(() => {
        this.setState({
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
        });
        daysOfWeek = [];
        this.getAlarms();
      });
  }
  render() {
    console.log(this.state);
    return (
      <div className="container" id="alarmManager">
        <div className="row">
          <div className="col-xs-12" id="timeSet">
            <h1 className="unselectable" id="hour" onClick={this.incrementHour}>{this.state.hourDisplay}</h1>
            <h1 className="unselectable">:</h1>
            <h1 className="unselectable" id="minute" onClick={this.incrementMinute}>{this.state.minuteDisplay}</h1>
            <h1 className="unselectable" id="ampm" onClick={this.changeAMPM}>{this.state.ampm}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12" id="daysOfWeek">
            <h3 id="alarmManagerPrompt">Which days would you like to set this alarm for?</h3>
            <h3 className="unselectable dayOfWeek Monday" id={this.state.Monday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Monday'); }}>M</h3>
            <h3 className="unselectable dayOfWeek Tuesday" id={this.state.Tuesday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Tuesday'); }}>T</h3>
            <h3 className="unselectable dayOfWeek Wednesday" id={this.state.Wednesday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Wednesday'); }}>W</h3>
            <h3 className="unselectable dayOfWeek Thursday" id={this.state.Thursday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Thursday'); }}>Th</h3>
            <h3 className="unselectable dayOfWeek Friday" id={this.state.Friday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Friday'); }}>Fri</h3>
            <h3 className="unselectable dayOfWeek Saturday" id={this.state.Saturday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Saturday'); }}>Sat</h3>
            <h3 className="unselectable dayOfWeek Sunday" id={this.state.Sunday === true ? 'selected' : 'unselected'} onClick={() => { this.chooseDay('Sunday'); }}>Sun</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h3 className="unselectable" id="setAlarm" onClick={this.setAlarm}>Set Alarm</h3>
            <h3 className="unselectable" id="displayBlock"><Link to="/">Back to Clock</Link></h3>
          </div>
        </div>
        <CurrentAlarms alarms={this.state.alarms} />
      </div>
    );
  }
}
