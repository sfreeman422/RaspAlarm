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
      .catch(err => console.log(err));
  };

  setAlarm = () => {
    const { ampm, hour, minute } = this.state;
    const data = {
      hour: hour < 10 ? `0${hour}` : hour,
      minute: minute < 10 ? `0${minute}` : minute,
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

  chooseDay = day => {
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
  };

  incrementMinute = () => {
    const { minute } = this.state;

    if (minute >= 55 && minute <= 59) {
      this.setState({
        minute: 0,
        minuteDisplay: "00"
      });
    } else if (minute < 10) {
      const nextMinute = minute + 5;
      this.setState({
        minute: nextMinute,
        minuteDisplay:
          nextMinute === 10 ? nextMinute : `0${nextMinute.toString()}`
      });
    } else {
      this.setState({
        minute: minute + 5,
        minuteDisplay: minute + 5
      });
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

  render() {
    // Ugly day of the week stuff here. Needs refactoring.
    const {
      hour,
      minute,
      ampm,
      alarms,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    } = this.state;
    return (
      <div className="container" id="alarmManager">
        <div className="row">
          <div className="col-xs-12" id="timeSet">
            <h1 className="unselectable" id="hour" onClick={this.incrementHour}>
              {hour < 10 ? `0${hour}` : hour}
            </h1>
            <h1 className="unselectable">:</h1>
            <h1
              className="unselectable"
              id="minute"
              onClick={this.incrementMinute}
            >
              {minute < 10 ? `0${minute}` : minute}
            </h1>
            <h1 className="unselectable" id="ampm" onClick={this.changeAMPM}>
              {ampm}
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
              id={Monday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Monday");
              }}
            >
              M
            </h3>
            <h3
              className="unselectable dayOfWeek Tuesday"
              id={Tuesday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Tuesday");
              }}
            >
              T
            </h3>
            <h3
              className="unselectable dayOfWeek Wednesday"
              id={Wednesday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Wednesday");
              }}
            >
              W
            </h3>
            <h3
              className="unselectable dayOfWeek Thursday"
              id={Thursday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Thursday");
              }}
            >
              Th
            </h3>
            <h3
              className="unselectable dayOfWeek Friday"
              id={Friday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Friday");
              }}
            >
              Fri
            </h3>
            <h3
              className="unselectable dayOfWeek Saturday"
              id={Saturday ? "selected" : "unselected"}
              onClick={() => {
                this.chooseDay("Saturday");
              }}
            >
              Sat
            </h3>
            <h3
              className="unselectable dayOfWeek Sunday"
              id={Sunday ? "selected" : "unselected"}
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
        <CurrentAlarms alarms={alarms} removeAlarm={this.removeAlarm} />
      </div>
    );
  }
}
