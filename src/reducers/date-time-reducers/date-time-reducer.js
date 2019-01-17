import * as types from "../../actions/action-types";

const initialState = {
  time: "",
  date: "",
  today: "",
  isNight: undefined
};

const dateTimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TIME:
      return {
        ...state,
        time: action.payload
      };
    case types.SET_DATE:
      return {
        ...state,
        date: action.payload
      };
    case types.SET_NIGHT:
      return {
        ...state,
        isNight: action.payload
      };
    case types.SET_TODAY:
      return {
        ...state,
        today: action.payload
      };
    default:
      return state;
  }
};

export default dateTimeReducer;
