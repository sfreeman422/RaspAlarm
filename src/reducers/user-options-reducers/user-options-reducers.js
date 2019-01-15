import * as types from "../../actions/action-types";

const initialState = {
  showDeltas: true,
  celcius: false,
  coloredIcons: true,
  blinkTime: true,
  showPadded: false,
  is24HourClock: false,
  preciseTemperature: true // Currently not configurable.
};

const userOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_DELTAS:
      return {
        ...state,
        showDeltas: action.payload
      };
    case types.SHOW_CELCIUS:
      return {
        ...state,
        celcius: action.payload
      };
    case types.SHOW_COLORED_ICONS:
      return {
        ...state,
        coloredIcons: action.payload
      };
    case types.SET_BLINK_TIME:
      return {
        ...state,
        blinkTime: action.payload
      };
    case types.SET_SHOW_PADDED:
      return {
        ...state,
        showPadded: action.payload
      };
    case types.SET_IS_24_HOUR_CLOCK:
      return {
        ...state,
        is24HourClock: action.payload
      };
    default:
      return state;
  }
};

export default userOptionsReducer;
