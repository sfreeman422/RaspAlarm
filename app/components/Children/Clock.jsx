import React from 'react';
import { connect } from 'react-redux';
import { adjustTime } from '../../actions/actions';
// Gets the time for the alarm clock.
getTime() {
  if (this.state.time !== moment().format('hh:mm' + 'a')) {
    this.setState({
      time: moment().format('hh:mm' + 'a'),
    });
  }
  if (this.state.date !== moment().format('MMMM Do YYYY')) {
    this.setState({
      date: moment().format('MMMM Do YYYY'),
    });
  }
  if (this.state.today !== moment().format('dddd')) {
    this.setState({
      today: moment().format('dddd'),
    });
  }
  if (this.state.time === this.state.sunset) {
    isNight = true;
    this.adjustBrightness();
  }
  if (this.state.time === this.state.sunrise) {
    isNight = false;
    this.adjustBrightness();
  }
  if (isNight !== oldIsNight && isNight !== undefined) {
    this.adjustBrightness();
  }
}
const mapStateToProps = state => ({ time: state.time });

const mapDispatchToProps = dispatch => ({
  adjustTime: time => dispatch(adjustTime(time))
});

const ConnectedClock = ({ time }) => (
  <div className="clock">
    <h1 className="time">{time}</h1>
  </div>
);

const Clock = connect(mapStateToProps, mapDispatchToProps)(ConnectedClock);

export default Clock;
