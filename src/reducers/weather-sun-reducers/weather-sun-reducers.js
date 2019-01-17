import * as types from "../../actions/action-types";

const initialState = {
  weatherArr: [],
  sunData: {},
  lastTemperature: undefined
};

const weatherSunReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_WEATHER:
      return {
        ...state,
        weatherArr: action.payload
      };
    case types.SET_SUNDATA:
      return {
        ...state,
        sunData: action.payload
      };
    case types.SET_LAST_TEMPERATURE:
      return {
        ...state,
        lastTemperature: action.payload
      };
    default:
      return state;
  }
};

export default weatherSunReducer;
