import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  time: state.time, blinkTime: state.blinkTime, showPadded: state.showPadded, is24HourClock: state.is24HourClock,
});

class ConnectedClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isColonVisible: false,
    };
    this.blinkColon = this.blinkColon.bind(this);
    this.blinkInterval = setInterval(this.blinkColon, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.blinkInterval);
  }

  blinkColon() {
    if (this.props.blinkTime) {
      this.setState({
        isColonVisible: !this.state.isColonVisible,
      });
    }
  }

  render() {
    const { is24HourClock, blinkTime, showPadded } = this.props;
    return (
      <div className="clock">
        {blinkTime ?
          <React.Fragment>
            <h1 className="time" id="blink">
              {is24HourClock && showPadded && moment().format('HH')}
              {is24HourClock && !showPadded && moment().format('H')}
              {!is24HourClock && showPadded && moment().format('hh')}
              {!is24HourClock && !showPadded && moment().format('h')}
            </h1>
            <h1 className="time" id="blink" style={{ visibility: this.props.blinkTime && !this.state.isColonVisible ? 'hidden' : 'visible' }}>:</h1>
            <h1 className="time" id="blink">{moment().format('mma')}</h1>
          </React.Fragment> : <h1 className="time">{moment().format('hh:mma')}</h1>
        }
      </div>
    );
  }
}

const Clock = connect(mapStateToProps)(ConnectedClock);

ConnectedClock.propTypes = {
  blinkTime: PropTypes.bool.isRequired,
  showPadded: PropTypes.bool.isRequired,
  is24HourClock: PropTypes.bool.isRequired,
};

export default Clock;
