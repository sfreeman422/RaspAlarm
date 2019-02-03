import React from "react";
import { Link } from "react-router";
import fetch from "isomorphic-fetch";
import moment from "moment";
import CurrentAlarms from "./CurrentAlarms";
import DayOfWeek from "./DayOfWeek";
import * as styles from "./AlarmManager.module.css";
import * as globalStyles from "../../App.module.css";

export default class AlarmManager extends React.Component {
  constructor() {
    super();
    this.state = {
      hour: parseInt(moment().format("h"), 10),
      minute: undefined,
      ampm: moment().format("a"),
      days: [],
      alarms: []
    };
    this.daysOfWeek = [
      { day: "Monday", abbrev: "M" },
      { day: "Tuesday", abbrev: "T" },
      { day: "Wednesday", abbrev: "W" },
      { day: "Thursday", abbrev: "Th" },
      { day: "Friday", abbrev: "Fri" },
      { day: "Saturday", abbrev: "Sat" },
      { day: "Sunday", abbrev: "Sun" }
    ];
  }

  componentDidMount() {
    this.setMinute();
    this.getAlarms();
  }

  getAlarms = () => {
    fetch("/alarm")
      .then(res => res.json())
      .then(alarms => {
        this.setState({ alarms });
      })
      .catch(err => console.error(err));
  };

  setAlarm = () => {
    const { ampm, hour, minute, days } = this.state;
    fetch("/alarm", {
      method: "POST",
      body: JSON.stringify({
        hour: hour < 10 ? `0${hour}` : hour,
        minute: minute < 10 ? `0${minute}` : minute,
        ampm,
        dayOfWeek: days,
        oneTimeUse: days === []
      }),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(() => {
        this.setState({
          days: []
        });
        this.getAlarms();
      })
      .catch(e => {
        console.error("Unable to set alarm. ", e);
      });
  };

  setMinute = () => {
    const { hour } = this.state;
    const minute = parseInt(moment().format("mm"), 10);
    if (minute < 10 && minute > 0) {
      this.setState({ minute: 10 });
    } else if (minute >= 55 && minute <= 59) {
      this.setState({ minute: 0, hour: hour + 1 });
    } else if (minute === 0) {
      this.setState({ minute: 0 });
    } else {
      this.setState({ minute: Math.ceil(minute / 5) * 5 });
    }
  };

  incrementHour = () => {
    const { hour } = this.state;
    if (hour === 12) {
      this.setState({
        hour: 1
      });
    } else {
      this.setState({
        hour: hour + 1
      });
    }
  };

  changeAMPM = () => {
    const { ampm } = this.state;
    this.setState({
      ampm: ampm === "am" ? "pm" : "am"
    });
  };

  removeDay = day => {
    const { days } = this.state;
    days.splice(days.indexOf(day), 1);
    this.setState({ days });
  };

  chooseDay = day => {
    const { days } = this.state;
    this.setState({ days: [...days, day] });
  };

  incrementMinute = () => {
    const { minute } = this.state;
    this.setState({ minute: minute >= 55 ? 0 : minute + 5 });
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

  render() {
    const { hour, minute, ampm, alarms, days } = this.state;
    return (
      <div className={globalStyles.container}>
        <h1 className={styles.unselectable} onClick={this.incrementHour}>
          {hour < 10 ? `0${hour}` : hour}
        </h1>
        <h1 className={styles.unselectable}>:</h1>
        <h1 className={styles.unselectable} onClick={this.incrementMinute}>
          {minute < 10 ? `0${minute}` : minute}
        </h1>
        <h1 className={styles.unselectable} onClick={this.changeAMPM}>
          {ampm}
        </h1>
        <h3 className={styles.alarmManagePrompt}>
          Which days would you like to set this alarm for?
        </h3>
        {this.daysOfWeek.map(day => (
          <DayOfWeek
            key={day.day}
            day={day.day}
            days={days}
            abbreviation={day.abbrev}
            chooseDay={this.chooseDay}
            removeDay={this.removeDay}
          />
        ))}
        <h3 className={styles.setAlarm} onClick={this.setAlarm}>
          Set Alarm
        </h3>
        <h3 className={styles.unselectable}>
          <Link to="/">Back to Clock</Link>
        </h3>
        <CurrentAlarms alarms={alarms} removeAlarm={this.removeAlarm} />
      </div>
    );
  }
}
