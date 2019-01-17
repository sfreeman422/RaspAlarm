import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const mapStateToProps = state => ({
  time: state.dateTime.time,
  userOptions: state.userOptions
});

class ConnectedClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isColonVisible: false
    };
    this.blinkInterval = setInterval(() => this.blinkColon(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.blinkInterval);
  }

  blinkColon = () => {
    if (this.props.userOptions.blinkTime.isEnabled) {
      this.setState({
        isColonVisible: !this.state.isColonVisible
      });
    }
  };

  render() {
    const {
      is24HourClock: { isEnabled: is24HourClock },
      blinkTime: { isEnabled: blinkTime },
      showPaddedZeroes: { isEnabled: showPaddedZeroes }
    } = this.props.userOptions;
    return (
      <div className="clock">
        {blinkTime ? (
          <React.Fragment>
            <h1 className="time" id="blink">
              {is24HourClock && showPaddedZeroes && moment().format("HH")}
              {is24HourClock && !showPaddedZeroes && moment().format("H")}
              {!is24HourClock && showPaddedZeroes && moment().format("hh")}
              {!is24HourClock && !showPaddedZeroes && moment().format("h")}
            </h1>
            <h1
              className="time"
              id="blink"
              style={{
                visibility:
                  blinkTime && !this.state.isColonVisible ? "hidden" : "visible"
              }}
            >
              :
            </h1>
            <h1 className="time" id="blink">
              {moment().format(is24HourClock ? "mm" : "mma")}
            </h1>
          </React.Fragment>
        ) : (
          <h1 className="time">
            {is24HourClock
              ? moment().format("HH:mm")
              : moment().format("hh:mma")}
          </h1>
        )}
      </div>
    );
  }
}

const Clock = connect(mapStateToProps)(ConnectedClock);

ConnectedClock.propTypes = {
  userOptions: PropTypes.shape({
    blinkTime: PropTypes.shape({
      isEnabled: PropTypes.bool.isRequired,
      friendlyName: PropTypes.string.isRequired
    }),
    showPaddedZeroes: PropTypes.shape({
      isEnabled: PropTypes.bool.isRequired,
      friendlyName: PropTypes.string.isRequired
    }),
    is24HourClock: PropTypes.shape({
      isEnabled: PropTypes.bool.isRequired,
      friendlyName: PropTypes.string.isRequired
    })
  })
};

export default Clock;
