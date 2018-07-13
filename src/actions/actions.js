import * as types from '../constants/action-types';

export const adjustTime = time => ({
  type: types.ADJUST_TIME,
  payload: time,
});

export const adjustDate = date => ({
  type: types.ADJUST_DATE,
  payload: date,
});

export const adjustToday = today => ({
  type: types.ADJUST_TODAY,
  payload: today,
});

export const adjustWeather = weather => ({
  type: types.ADJUST_WEATHER,
  payload: weather,
});

export const adjustUserLoc = userLoc => ({
  type: types.ADJUST_USERLOC,
  payload: userLoc,
});

export const adjustSunData = sunData => ({
  type: types.ADJUST_SUNDATA,
  payload: sunData,
});

export const getAlarms = alarms => ({
  type: types.GET_ALARMS,
  payload: alarms,
});

export const adjustNight = night => ({
  type: types.ADJUST_NIGHT,
  payload: night,
});

export const reportError = error => ({
  type: types.REPORT_ERROR,
  payload: error,
});

export const adjustUserCoords = location => ({
  type: types.ADJUST_USERCOORDS,
  payload: location,
});

export const adjustWeatherStatus = weatherStatus => ({
  type: types.ADJUST_WEATHER_STATUS,
  payload: weatherStatus,
});

export const adjustLoadingStatus = status => ({
  type: types.ADJUST_LOADING_STATUS,
  payload: status,
});

export const adjustDeltas = delta => ({
  type: types.ADJUST_DELTAS,
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

export const addLocation = location => ({
  types: types.ADD_LOCATION,
  payload: location,
});
