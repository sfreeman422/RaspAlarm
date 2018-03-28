import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({ time: state.time });

const ConnectedClock = ({ time }) => (
  <div className="clock">
    <h1 className="time">{time}</h1>
  </div>
);

const Clock = connect(mapStateToProps)(ConnectedClock);

ConnectedClock.propTypes = {
  time: PropTypes.string.isRequired,
};

export default Clock;
