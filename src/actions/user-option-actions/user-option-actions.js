import * as types from "../action-types";

export const setShowDeltas = delta => ({
  type: types.SET_SHOW_DELTAS,
  payload: delta
});

export const setShowCelcius = celcius => ({
  type: types.SET_SHOW_CELCIUS,
  payload: celcius
});

export const setShowColoredIcons = showIcons => ({
  type: types.SET_SHOW_COLORED_ICONS,
  payload: showIcons
});

export const setBlinkTime = blinkTime => ({
  type: types.SET_BLINK_TIME,
  payload: blinkTime
});

export const setShowPaddedZeroes = showPadded => ({
  type: types.SET_SHOW_PADDED_ZEROES,
  payload: showPadded
});

export const setIs24HourClock = is24 => ({
  type: types.SET_IS_24_HOUR_CLOCK,
  payload: is24
});

export const setShowPreciseTemperature = showPreciseTemperature => ({
  type: types.SET_SHOW_PRECISE_TEMPERATURE,
  payload: showPreciseTemperature
});

export const setIsPhillipsHue = isPhillipsHue => ({
  type: types.SET_IS_PHILLIPS_HUE,
  payload: isPhillipsHue
});
