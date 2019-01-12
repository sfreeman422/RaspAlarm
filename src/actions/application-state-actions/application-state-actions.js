import * as types from "../../constants/action-types";
export const getAlarms = alarms => ({
  type: types.GET_ALARMS,
  payload: alarms
});

export const reportError = error => ({
  type: types.REPORT_ERROR,
  payload: error
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
  payload: undefined
});

export const setLoadingStatus = status => ({
  type: types.SET_LOADING_STATUS,
  payload: status
});

export const setLastTemperature = temperature => ({
  type: types.SET_LAST_TEMPERATURE,
  payload: temperature
});

export const setInitialized = initialized => ({
  type: types.SET_INITIALIZED,
  payload: initialized
});

export const setHueData = data => ({
  type: types.SET_HUE_DATA,
  payload: data
});
