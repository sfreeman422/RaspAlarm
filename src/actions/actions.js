import { ADJUST_TIME, ADJUST_DATE, ADJUST_TODAY, ADJUST_NIGHT, ADJUST_WEATHER, ADJUST_USERLOC, ADJUST_SUNDATA, GET_ALARMS, REPORT_ERROR, ADJUST_USERCOORDS } from '../constants/action-types';

export const adjustTime = time => ({
  type: ADJUST_TIME,
  payload: time,
});
export const adjustDate = date => ({
  type: ADJUST_DATE,
  payload: date,
});
export const adjustToday = today => ({
  type: ADJUST_TODAY,
  payload: today,
});
export const adjustWeather = weather => ({
  type: ADJUST_WEATHER,
  payload: weather,
});

export const adjustUserLoc = userLoc => ({
  type: ADJUST_USERLOC,
  payload: userLoc,
});

export const adjustSunData = sunData => ({
  type: ADJUST_SUNDATA,
  payload: sunData,
});

export const getAlarms = alarms => ({
  type: GET_ALARMS,
  payload: alarms,
});

export const adjustNight = night => ({
  type: ADJUST_NIGHT,
  payload: night,
});

export const reportError = error => ({
  type: REPORT_ERROR,
  payload: error,
});

export const adjustUserCoords = location => ({
  type: ADJUST_USERCOORDS,
  payload: location,
});
