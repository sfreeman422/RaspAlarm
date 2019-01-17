import * as types from "../action-types";

export const setUserLoc = userLoc => ({
  type: types.SET_USERLOC,
  payload: userLoc
});

export const setUserCoords = location => ({
  type: types.SET_USERCOORDS,
  payload: location
});

export const addLocation = location => ({
  type: types.ADD_LOCATION,
  payload: location
});
