import * as types from "../action-types";

export const setTime = time => ({
  type: types.SET_TIME,
  payload: time
});

export const setDate = date => ({
  type: types.SET_DATE,
  payload: date
});

export const setToday = today => ({
  type: types.SET_TODAY,
  payload: today
});
