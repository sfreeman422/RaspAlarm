import React from 'react';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  currentTime: state.time,
});

export class Alarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRinging: false,
      awake: false,
      alarms: [],
      ringingAlarm: {},
    };
    this.alarmInterval = undefined;
    this.alarmSound = new Audio('./sounds/alarm.mp3');
  }

  componentDidMount() {
    this.getAlarms();
    this.alarmInterval = setInterval(this.checkAlarm, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.alarmInterval);
  }

  getAlarms = () => {
    fetch('/alarms')
      .then(res => res.json())
      .then((alarms) => {
        this.setState({ alarms });
        this.checkAlarm();
      });
  }

  checkAlarm = () => {
    const dayOfWeek = moment().format('dddd');
    for (let i = 0; i < this.state.alarms.length; i += 1) {
      if (
        this.props.currentTime === this.state.alarms[i].time
        && !this.state.isRinging
        && !this.state.awake
        && (this.state.alarms[i].dayOfWeek.includes(dayOfWeek) || this.state.alarms[i].oneTimeUse)
      ) {
        this.alarmSound.play();
        this.setState({
          isRinging: true,
          ringingAlarm: this.state.alarms[i],
        });
      } else if (this.state.isRinging) {
        this.alarmSound.play();
      }
    }
  }

  removeAlarm = (id) => {
    fetch(
      '/deleteAlarm',
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

  awake = () => {
    this.setState({
      isRinging: false,
      awake: true,
    });
    if (this.state.ringingAlarm.oneTimeUse) {
      this.removeAlarm(this.state.ringingAlarm._id);
    }
    setTimeout(() => this.setState({ awake: false, ringingAlarm: {} }), 60000);
  }

  render() {
    return (
      <div id="alarm">
        {this.state.isRinging ?
          <button
            className="btn-lg btn-success"
            id="wakeUp"
            onClick={() => { this.awake(); }}
          >
            Wake Up
          </button> :
          <h3>
            <Link to="/AlarmManager">Set an alarm</Link>
          </h3>}
      </div>
    );
  }
}

Alarm.propTypes = {
  currentTime: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Alarm);
