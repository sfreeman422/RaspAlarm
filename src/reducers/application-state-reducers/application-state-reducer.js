import * as types from "../../actions/action-types";

const initialState = {
  alarms: [],
  error: undefined,
  loadingMessage: "",
  initialized: false,
  hueData: undefined
};

const applicationStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ALARMS:
      return {
        ...state,
        alarms: action.payload
      };
    case types.REPORT_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case types.CLEAR_ERROR:
      return {
        ...state,
        error: undefined
      };
    case types.SET_LOADING_STATUS:
      return {
        ...state,
        loadingMessage: action.payload
      };
    case types.SET_INITIALIZED:
      return {
        ...state,
        initialized: action.payload
      };
    case types.SET_HUE_DATA:
      return {
        ...state,
        hueData: action.payload
      };
    default:
      return state;
  }
};

export default applicationStateReducer;
