import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import * as actions from "../actions";

const mapStateToProps = state => ({
  userOptions: state.userOptions
});

const mapDispatchToProps = dispatch => ({
  setDeltas: delta => dispatch(actions.setShowDeltas(delta)),
  setShowCelcius: celcius => dispatch(actions.setShowCelcius(celcius)),
  setShowColoredIcons: showIcons =>
    dispatch(actions.setShowColoredIcons(showIcons)),
  setBlinkTime: blinkTime => dispatch(actions.setBlinkTime(blinkTime)),
  setShowPaddedZeroes: showPaddedZeroes =>
    dispatch(actions.setShowPaddedZeroes(showPaddedZeroes)),
  setIs24HourClock: is24 => dispatch(actions.setIs24HourClock(is24)),
  setIsPhillipsHueEnabled: isPhillipsHueEnabled =>
    dispatch(actions.setIsPhillipsHueEnabled(isPhillipsHueEnabled)),
  setShowPreciseTemperature: showPreciseTemperature =>
    dispatch(actions.setShowPreciseTemperature(showPreciseTemperature))
});

const ConnectedSettings = ({
  setShowPaddedZeroes,
  setShowCelcius,
  setShowDeltas,
  setBlinkTime,
  setIs24HourClock,
  setShowPreciseTemperature,
  userOptions
}) => (
  <div className="container" id="settings">
    <h1>Settings</h1>
    <div>
      <span>{userOptions.showCelcius.friendlyName}</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.showCelcius.isEnabled}
          onChange={() => setShowCelcius(!userOptions.showCelcius.isEnabled)}
        />
      </span>
    </div>
    <div>
      <span>Show Temperature Delta Indicators? </span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.showDeltas.isEnabled}
          onChange={() => setShowDeltas(!userOptions.showDeltas.isEnabled)}
        />
      </span>
    </div>
    <div>
      <span>Blink Time Colon</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.blinkTime.isEnabled}
          onChange={() => setBlinkTime(!userOptions.blinkTime.isEnabled)}
        />
      </span>
    </div>
    <div>
      <span>Precise Temperatures? (WIP)</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.showPreciseTemperature.isEnabled}
          onChange={() =>
            setShowPreciseTemperature(
              !userOptions.showPreciseTemperature.isEnabled
            )
          }
        />
      </span>
    </div>
    <div>
      <span>Show padded zeroes?</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.showPaddedZeroes.isEnabled}
          onChange={() =>
            setShowPaddedZeroes(!userOptions.showPaddedZeroes.isEnabled)
          }
        />
      </span>
    </div>
    <div>
      <span>24 hour clock?</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.is24HourClock.isEnabled}
          onChange={() =>
            setIs24HourClock(!userOptions.is24HourClock.isEnabled)
          }
        />
      </span>
    </div>
    <Link to="/">
      <button id="modal-button">Back to Clock</button>
    </Link>
  </div>
);

ConnectedSettings.propTypes = {
  userOptions: PropTypes.shape({
    showPadded: PropTypes.bool.isRequired,
    showCelcius: PropTypes.bool.isRequired,
    showPaddedZeroes: PropTypes.bool.isRequired,
    showCelcisu: PropTypes.bool.isRequired,
    showDeltas: PropTypes.bool.isRequired,
    blinkTime: PropTypes.bool.isRequired,
    is24HourClock: PropTypes.bool.isRequired,
    showPreciseTemperature: PropTypes.bool.isRequired
  }),
  setShowPadded: PropTypes.func.isRequired,
  setShowCelcius: PropTypes.func.isRequired,
  setShowDeltas: PropTypes.func.isRequired,
  setBlinkTime: PropTypes.func.isRequired,
  setIs24HourClock: PropTypes.func.isRequired,
  setShowPriceTemperature: PropTypes.func.isRequired
};

const SettingsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSettings);

export default SettingsModal;
