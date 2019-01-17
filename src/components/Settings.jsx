import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import * as actions from "../actions";

const mapStateToProps = state => ({
  userOptions: state.userOptions
});

const mapDispatchToProps = dispatch => ({
  setShowDeltas: delta => dispatch(actions.setShowDeltas(delta)),
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
      <span>{userOptions.showDeltas.friendlyName}</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.showDeltas.isEnabled}
          onChange={() => setShowDeltas(!userOptions.showDeltas.isEnabled)}
        />
      </span>
    </div>
    <div>
      <span>{userOptions.blinkTime.friendlyName}</span>
      <span>
        <input
          type="checkbox"
          checked={userOptions.blinkTime.isEnabled}
          onChange={() => setBlinkTime(!userOptions.blinkTime.isEnabled)}
        />
      </span>
    </div>
    <div>
      <span>{userOptions.showPreciseTemperature.friendlyName}</span>
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
      <span>{userOptions.showPaddedZeroes.friendlyName}</span>
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
      <span>{userOptions.is24HourClock.friendlyName}</span>
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
    showCelcius: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    }).isRequired,
    showPaddedZeroes: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    }).isRequired,
    showDeltas: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    }),
    blinkTime: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    }),
    is24HourClock: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    }),
    showPreciseTemperature: PropTypes.shape({
      friendlyName: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired
    })
  }),
  setShowPaddedZeroes: PropTypes.func.isRequired,
  setShowCelcius: PropTypes.func.isRequired,
  setShowDeltas: PropTypes.func.isRequired,
  setBlinkTime: PropTypes.func.isRequired,
  setIs24HourClock: PropTypes.func.isRequired,
  setShowPreciseTemperature: PropTypes.func.isRequired
};

const SettingsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSettings);

export default SettingsModal;
