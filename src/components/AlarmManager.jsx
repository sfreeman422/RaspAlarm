import React from "react";
import { Link } from "react-router";
import fetch from "isomorphic-fetch";
import moment from "moment";
import CurrentAlarms from "./CurrentAlarms";

export default class AlarmManager extends React.Component {
  constructor() {
    super();
    this.state = {
      hour: parseInt(moment().format("h"), 10),
      minute: undefined,
      ampm: moment().format("a"),
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
      alarms: []
    };
    this.daysOfWeek = [];
    this.incrementHour = this.incrementHour.bind(this);
    this.incrementMinute = this.incrementMinute.bind(this);
    this.changeAMPM = this.changeAMPM.bind(this);
    this.chooseDay = this.chooseDay.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
    this.removeAlarm = this.removeAlarm.bind(this);
    this.setMinute = this.setMinute.bind(this);
  }

  componentDidMount() {
    this.setMinute();
    this.getAlarms();
  }

  getAlarms() {
    fetch("/alarm")
      .then(res => res.json())
      .then(alarms => {
        this.setState({ alarms });
      })
      .catch(err => console.log(err));
  }

  setAlarm() {
    const { ampm, hour, minute } = this.state;
    const data = {
      hour: this.state.hour < 10 ? `0${hour}` : hour,
      minute: this.state.minute < 10 ? `0${minute}` : minute,
      ampm,
      dayOfWeek: this.daysOfWeek
    };
    fetch("/alarm", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).then(() => {
      this.setState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      });
      this.daysOfWeek = [];
      this.getAlarms();
    });
  }

  setMinute() {
    const minute = parseInt(moment().format("mm"), 10);
    if (minute < 10 && minute > 0) {
      this.setState({ minute: 10 });
    } else if (minute >= 55 && minute <= 59) {
      this.setState({ minute: 0, hour: this.state.hour + 1 });
    } else if (minute === 0) {
      this.setState({ minute: 0 });
    } else {
      this.setState({ minute: Math.ceil(minute / 5) * 5 });
    }
  }

  incrementHour() {
    if (this.state.hour === 12) {
      this.setState({
        hour: 1
      });
    } else {
      this.setState({
        hour: this.state.hour + 1
      });
    }
  }

  changeAMPM() {
    if (this.state.ampm === "am") {
      this.setState({
        ampm: "pm"
      });
    } else {
      this.setState({
        ampm: "am"
      });
    }
  }

  chooseDay(day) {
    if (!this.state[day]) {
      this.setState({
        [day]: true
      });
      this.daysOfWeek.push(day);
    } else {
      this.setState({
        [day]: false
      });
      for (let i = 0; i < this.daysOfWeek.length; i += 1) {
        if (this.daysOfWeek[i] === day) {
          this.daysOfWeek.splice(i, 1);
        }
      }
    }
  }
  incrementMinute() {
    if (this.state.minute >= 55 && this.state.minute <= 59) {
      this.setState({
        minute: 0,
        minuteDisplay: "00"
      });
    } else if (this.state.minute < 10) {
      const stringMinute = this.state.minute + 5;
      if (stringMinute === 10) {
        this.setState({
          minute: stringMinute,
          minuteDisplay: stringMinute
        });
      } else {
        this.setState({
          minute: this.state.minute + 5,
          minuteDisplay: `0${stringMinute.toString()}`
        });
      }
    } else {
      this.setState({
        minute: this.state.minute + 5,
        minuteDisplay: this.state.minute + 5
      });
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
  render() {
    return (
      <div className="container" id="alarmManager">
        <div className="row">
          <div className="col-xs-12" id="timeSet">
            <h1 className="unselectable" id="hour" onClick={this.incrementHour}>
              {this.state.hour < 10 ? `0${this.state.hour}` : this.state.hour}
            </h1>
            <h1 className="unselectable">:</h1>
            <h1
              className="unselectable"
              id="minute"
              onClick={this.incrementMinute}
            >
              {this.state.minute < 10
                ? `0${this.state.minute}`
                : this.state.minute}
            </h1>
            <h1 className="unselectable" id="ampm" onClick={this.changeAMPM}>
              {this.state.ampm}
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12" id="daysOfWeek">
            <h3 id="alarmManagerPrompt">
              Which days would you like to set this alarm for?
            </h3>
            <h3
              className="unselectable dayOfWeek Monday"
              id={this.state.Monday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Monday");
              }}
            >
              M
            </h3>
            <h3
              className="unselectable dayOfWeek Tuesday"
              id={this.state.Tuesday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Tuesday");
              }}
            >
              T
            </h3>
            <h3
              className="unselectable dayOfWeek Wednesday"
              id={this.state.Wednesday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Wednesday");
              }}
            >
              W
            </h3>
            <h3
              className="unselectable dayOfWeek Thursday"
              id={this.state.Thursday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Thursday");
              }}
            >
              Th
            </h3>
            <h3
              className="unselectable dayOfWeek Friday"
              id={this.state.Friday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Friday");
              }}
            >
              Fri
            </h3>
            <h3
              className="unselectable dayOfWeek Saturday"
              id={this.state.Saturday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Saturday");
              }}
            >
              Sat
            </h3>
            <h3
              className="unselectable dayOfWeek Sunday"
              id={this.state.Sunday === true ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Sunday");
              }}
            >
              Sun
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h3 className="unselectable" id="setAlarm" onClick={this.setAlarm}>
              Set Alarm
            </h3>
            <h3 className="unselectable" id="displayBlock">
              <Link to="/">Back to Clock</Link>
            </h3>
          </div>
        </div>
        <CurrentAlarms
          alarms={this.state.alarms}
          removeAlarm={this.removeAlarm}
        />
      </div>
    );
  }
}
