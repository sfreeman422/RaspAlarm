import React from "react";
import moment from "moment";
import fetch from "isomorphic-fetch";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";

const mapStateToProps = state => ({
  currentTime: state.time
});

class ConnectedAlarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRinging: false,
      awake: false,
      alarms: [],
      ringingAlarm: {}
    };
    this.getAlarms = this.getAlarms.bind(this);
    this.checkAlarm = this.checkAlarm.bind(this);
    this.awake = this.awake.bind(this);
    this.removeAlarm = this.removeAlarm.bind(this);
    this.alarmInterval = undefined;
    this.alarmSound = new Audio("./sounds/alarm.mp3");
  }

  componentDidMount() {
    this.getAlarms();
    this.alarmInterval = setInterval(this.checkAlarm, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.alarmInterval);
  }

  getAlarms() {
    fetch("/alarm")
      .then(res => res.json())
      .then(alarms => {
        this.setState({ alarms });
        this.checkAlarm();
      });
  }

  checkAlarm() {
    const dayOfWeek = moment().format("dddd");
    for (let i = 0; i < this.state.alarms.length; i += 1) {
      if (
        this.props.currentTime === this.state.alarms[i].time &&
        !this.state.isRinging &&
        !this.state.awake &&
        (this.state.alarms[i].dayOfWeek.includes(dayOfWeek) ||
          this.state.alarms[i].oneTimeUse)
      ) {
        this.alarmSound.play();
        this.setState({
          isRinging: true,
          ringingAlarm: this.state.alarms[i]
        });
      } else if (this.state.isRinging) {
        this.alarmSound.play();
      }
    }
  }

  removeAlarm(id) {
    fetch("/alarm", {
      method: "DELETE",
      body: JSON.stringify({
        id,
        _method: "delete"
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).then(() => {
      this.getAlarms();
    });
  }

  snooze() {
    this.setState({
      isRinging: false,
      awake: true
    });
    // Add an alarm at the current time + 5 minutes.
    // To be added: custom snoozes
    fetch("/alarm", {
      method: "POST",
      body: JSON.stringify({
        hour: moment().format("hh"),
        minute: moment()
          .add(5, "minutes")
          .format("mm"),
        ampm: moment().format("a"),
        dayOfWeek: []
      }),
      headers: new Headers({
        "Content-type": "application/json"
      })
    }).then(() => this.getAlarms());
    if (this.state.ringingAlarm.oneTimeUse) {
      this.removeAlarm(this.state.ringingAlarm._id);
    }
  }

  awake() {
    this.setState({
      isRinging: false,
      awake: true
    });
    if (this.state.ringingAlarm.oneTimeUse) {
      this.removeAlarm(this.state.ringingAlarm._id);
    }
    setTimeout(() => this.setState({ awake: false, ringingAlarm: {} }), 60000);
  }

  render() {
    return (
      <div id="alarm">
        {this.state.isRinging ? (
          <React.Fragment>
            <button
              className="btn-lg btn-danger"
              id="wakeUp"
              onClick={() => {
                this.snooze();
              }}
            >
              Snooze
            </button>
            <button
              className="btn-lg btn-success"
              id="wakeUp"
              onClick={() => {
                this.awake();
              }}
            >
              Wake Up
            </button>
          </React.Fragment>
        ) : (
          <h3>
            <Link to="/AlarmManager">Set an alarm</Link>
          </h3>
        )}
      </div>
    );
  }
}

const Alarm = connect(mapStateToProps)(ConnectedAlarm);

ConnectedAlarm.propTypes = {
  currentTime: PropTypes.string.isRequired
};

export default Alarm;
