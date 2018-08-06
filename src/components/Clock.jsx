import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({ time: state.time, blinkTime: state.blinkTime });

export class Clock extends React.Component {
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

  blinkColon = () => {
    if (this.props.blinkTime) {
      this.setState({
        isColonVisible: !this.state.isColonVisible,
      });
    }
  }

  render() {
    const { time, blinkTime } = this.props;
    return (
      <div className="clock">
        {blinkTime ?
          <React.Fragment>
            <h1 className="time" id="blink">{time.slice(0, 2)}</h1>
            <h1 className="time" id="blink" style={{ visibility: this.props.blinkTime && !this.state.isColonVisible ? 'hidden' : 'visible' }}>{time.charAt(2)}</h1>
            <h1 className="time" id="blink">{time.slice(3, time.length)}</h1>
          </React.Fragment> : <h1 className="time">{time}</h1>
        }
      </div>
    );
  }
}

Clock.propTypes = {
  time: PropTypes.string.isRequired,
  blinkTime: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Clock);
