import * as types from '../constants/action-types';

export const setTime = time => ({
  type: types.SET_TIME,
  payload: time,
});

export const setDate = date => ({
  type: types.SET_DATE,
  payload: date,
});

export const setToday = today => ({
  type: types.SET_TODAY,
  payload: today,
});

export const setWeather = weather => ({
  type: types.SET_WEATHER,
  payload: weather,
});

export const setUserLoc = userLoc => ({
  type: types.SET_USERLOC,
  payload: userLoc,
});

export const setSunData = sunData => ({
  type: types.SET_SUNDATA,
  payload: sunData,
});

export const getAlarms = alarms => ({
  type: types.GET_ALARMS,
  payload: alarms,
});

export const setNight = night => ({
  type: types.SET_NIGHT,
  payload: night,
});

export const reportError = error => ({
  type: types.REPORT_ERROR,
  payload: error,
});

export const setUserCoords = location => ({
  type: types.SET_USERCOORDS,
  payload: location,
});

export const setLoadingStatus = status => ({
  type: types.SET_LOADING_STATUS,
  payload: status,
});

export const setDeltas = delta => ({
  type: types.SET_DELTAS,
  payload: delta,
});

export const showCelcius = celcius => ({
  type: types.SHOW_CELCIUS,
  payload: celcius,
});

export const showColoredIcons = showIcons => ({
  type: types.SHOW_COLORED_ICONS,
  payload: showIcons,
});

export const setBlinkTime = blinkTime => ({
  type: types.SET_BLINK_TIME,
  payload: blinkTime,
});

export const addLocation = location => ({
  type: types.ADD_LOCATION,
  payload: location,
});

export const setLastTemperature = temperature => ({
  type: types.SET_LAST_TEMPERATURE,
  payload: temperature,
});
