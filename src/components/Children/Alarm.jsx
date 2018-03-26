import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const alarmSound = new Audio('./sounds/alarm.mp3');
let alarmInterval;

const mapStateToProps = state => ({
  currentTime: state.time,
});

class ConnectedAlarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmStatus: 'not ringing',
      awake: false,
      alarms: [],
      ringingAlarm: {},
    };
    this.getAlarms = this.getAlarms.bind(this);
    this.checkAlarm = this.checkAlarm.bind(this);
    this.awake = this.awake.bind(this);
    this.removeAlarm = this.removeAlarm.bind(this);
  }
  componentDidMount() {
    this.getAlarms();
    alarmInterval = setInterval(this.checkAlarm, 1000);
  }
  componentWillUnmount() {
    clearInterval(alarmInterval);
  }
  getAlarms() {
    fetch('/alarms')
      .then(res => res.json())
      .then((alarms) => {
        this.setState({ alarms });
        this.checkAlarm();
      });
  }
  // Function to check whether its time for an alarm to go off or not.
  checkAlarm() {
    const dayOfWeek = moment().format('dddd');
    for (let i = 0; i < this.state.alarms.length; i += 1) {
      if (
        this.props.currentTime === this.state.alarms[i].time
        && this.state.alarmStatus !== 'ringing'
        && !this.state.awake
        && (this.state.alarms[i].dayOfWeek.includes(dayOfWeek) || this.state.alarms[i].oneTimeUse)
      ) {
        alarmSound.play();
        this.setState({
          alarmStatus: 'ringing',
          ringingAlarm: this.state.alarms[i],
        });
      } else if (this.state.alarmStatus === 'ringing') {
        alarmSound.play();
      }
    }
  }
  removeAlarm(id) {
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
  awake() {
    this.setState({
      alarmStatus: 'not ringing',
      awake: true,
    });
    if (this.state.ringingAlarm.oneTimeUse) {
      this.removeAlarm(this.state.ringingAlarm._id);
    }
    // After 60 seconds, this will revert awake to false.
    // We wait 60 to prevent the alarm from continously going off
    // even when the user is awake.
    setTimeout(() => this.setState({ awake: false, ringingAlarm: {} }), 60000);
  }
  render() {
    if (this.state.alarmStatus === 'ringing') {
      return (
        <div id="alarm">
          <button
            className="btn-lg btn-success"
            id="wakeUp"
            onClick={() => { this.awake(); }}
          >Wake Up</button>
        </div>
      );
    }

    return (
      <div id="alarm">
        <h3><Link to="/AlarmManager">Set an alarm</Link></h3>
      </div>
    );
  }
}

const Alarm = connect(mapStateToProps)(ConnectedAlarm);

export default Alarm;
