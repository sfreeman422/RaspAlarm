import { ADJUST_DATETIME, GET_WEATHER, GET_USERLOC, ADJUST_SUNDATA } from '../constants/action-types';

export const adjustTime = time => ({
  type: ADJUST_DATETIME,
  payload: time,
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
