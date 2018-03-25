import { ADJUST_TIME, ADJUST_DATE, GET_WEATHER, GET_USERLOC, ADJUST_SUNDATA, GET_ALARMS } from '../constants/action-types';

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
export const getWeather = weather => ({
  type: GET_WEATHER,
  payload: weather,
});

export const getUserLoc = userLoc => ({
  type: GET_USERLOC,
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
