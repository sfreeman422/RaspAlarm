import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({ time: state.time, blinkTime: state.blinkTime, showPadded: state.showPadded });

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
    const { time, blinkTime, showPadded } = this.props;
    const isPadded = time.startsWith('0');
    return (
      <div className="clock">
        {blinkTime ?
          <React.Fragment>
            <h1 className="time" id="blink">{isPadded && !showPadded ? time.slice(1, 2) : time.slice(0, 2)}</h1>
            <h1 className="time" id="blink" style={{ visibility: this.props.blinkTime && !this.state.isColonVisible ? 'hidden' : 'visible' }}>{time.charAt(2)}</h1>
            <h1 className="time" id="blink">{time.slice(3, time.length)}</h1>
          </React.Fragment> : <h1 className="time">{time}</h1>
        }
      </div>
    );
  }
}

const Clock = connect(mapStateToProps)(ConnectedClock);

ConnectedClock.propTypes = {
  time: PropTypes.string.isRequired,
  blinkTime: PropTypes.bool.isRequired,
  showPadded: PropTypes.bool.isRequired,
};

export default Clock;
