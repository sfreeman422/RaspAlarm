import * as types from "../action-types";

export const setWeather = weather => ({
  type: types.SET_WEATHER,
  payload: weather
});

export const setSunData = sunData => ({
  type: types.SET_SUNDATA,
  payload: sunData
});

export const setNight = night => ({
  type: types.SET_NIGHT,
  payload: night
});

export const setLastTemperature = temperature => ({
  type: types.SET_LAST_TEMPERATURE,
  payload: temperature
});
