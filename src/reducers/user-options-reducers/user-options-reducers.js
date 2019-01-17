import * as types from "../../actions/action-types";

const initialState = {
  showDeltas: {
    friendlyName: "Display Temperature Deltas",
    isEnabled: true
  },
  showCelcius: {
    friendlyName: "Display Temperature in Celcius",
    isEnabled: false
  },
  showColoredIcons: {
    friendlyName: "Display Colored Icons",
    isEnabled: true
  },
  blinkTime: {
    friendlyName: "Blink Colon on Clock",
    isEnabled: true
  },
  showPaddedZeroes: {
    friendlyName: "Show Padded Zeroes",
    isEnabled: false
  },
  is24HourClock: {
    friendlyName: "User 24 Hour Clock",
    isEnabled: false
  },
  showPreciseTemperature: {
    friendlyName: "Show Decimals on Temperature",
    isEnabled: true
  },
  isPhillipsHueEnabled: {
    friendlyName: "Enable Home Automation with Phillips Hue",
    isEnabled: false
  }
};

const userOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SHOW_DELTAS:
      return {
        ...state,
        showDeltas: {
          friendlyName: state.showDeltas.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_SHOW_CELCIUS:
      return {
        ...state,
        showCelcius: {
          friendlyName: state.showCelcius.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_SHOW_COLORED_ICONS:
      return {
        ...state,
        coloredIcons: {
          friendlyName: state.showColoredIcons.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_BLINK_TIME:
      return {
        ...state,
        blinkTime: {
          friendlyName: state.blinkTime.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_SHOW_PADDED_ZEROES:
      return {
        ...state,
        showPaddedZeroes: {
          friendlyName: state.showPaddedZeroes.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_IS_24_HOUR_CLOCK:
      return {
        ...state,
        is24HourClock: {
          friendlyName: state.is24HourClock.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_SHOW_PRECISE_TEMPERATURE:
      return {
        ...state,
        showPreciseTemperature: {
          friendlyName: state.showPreciseTemperature.friendlyName,
          isEnabled: action.payload
        }
      };
    case types.SET_IS_PHILLIPS_HUE_ENABLED:
      return {
        ...state,
        isPhillipsHueEnabled: {
          friendlyName: state.isPhillipsHueEnabled.friendlyName,
          isEnabled: action.payload
        }
      };
    default:
      return state;
  }
};

export default userOptionsReducer;
