import React from "react";
import moment from "moment";
import fetch from "isomorphic-fetch";
import { Link } from "react-router";

class Alarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRinging: false,
      awake: false,
      alarms: [],
      ringingAlarm: {}
    };
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

  getAlarms = () => {
    fetch("/alarm")
      .then(res => res.json())
      .then(alarms => {
        this.setState({ alarms });
        this.checkAlarm();
      });
  };

  checkAlarm = () => {
    const { alarms, currentTime, isRinging, awake } = this.state;
    const dayOfWeek = moment().format("dddd");
    for (let i = 0; i < alarms.length; i += 1) {
      if (
        currentTime === alarms[i].time &&
        !isRinging &&
        !awake &&
        (alarms[i].dayOfWeek.includes(dayOfWeek) || alarms[i].oneTimeUse)
      ) {
        this.alarmSound.play();
        this.setState({
          isRinging: true,
          ringingAlarm: alarms[i]
        });
      } else if (isRinging) {
        this.alarmSound.play();
      }
    }
  };

  removeAlarm = id => {
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
  };

  snooze = () => {
    this.setState(
      {
        isRinging: false,
        awake: true
      },
      () => {
        const { ringingAlarm } = this.state;
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
        if (ringingAlarm.oneTimeUse) {
          this.removeAlarm(ringingAlarm._id);
        }
      }
    );
  };

  awake = () => {
    this.setState(
      {
        isRinging: false,
        awake: true
      },
      () => {
        const { ringingAlarm } = this.state;
        if (ringingAlarm.oneTimeUse) {
          this.removeAlarm(ringingAlarm._id);
        }
        setTimeout(
          () => this.setState({ awake: false, ringingAlarm: {} }),
          60000
        );
      }
    );
  };

  render() {
    const { isRinging } = this.state;
    return (
      <div id="alarm">
        {isRinging ? (
          <React.Fragment>
            <button
              type="button"
              id="snooze"
              onClick={() => {
                this.snooze();
              }}
            >
              Snooze
            </button>
            <button
              id="wakeUp"
              type="button"
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

export default Alarm;
