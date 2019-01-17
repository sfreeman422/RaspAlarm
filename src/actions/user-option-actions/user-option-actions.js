import * as types from "../action-types";

export const setDeltas = delta => ({
  type: types.SET_DELTAS,
  payload: delta
});

export const showCelcius = celcius => ({
  type: types.SHOW_CELCIUS,
  payload: celcius
});

export const showColoredIcons = showIcons => ({
  type: types.SHOW_COLORED_ICONS,
  payload: showIcons
});

export const setBlinkTime = blinkTime => ({
  type: types.SET_BLINK_TIME,
  payload: blinkTime
});

export const setShowPadded = showPadded => ({
  type: types.SET_SHOW_PADDED,
  payload: showPadded
});

export const setIs24HourClock = is24 => ({
  type: types.SET_IS_24_HOUR_CLOCK,
  payload: is24
});

export const setPreciseTemperature = showPreciseTemperature => ({
  type: types.SET_PRECISE_TEMPERATURE,
  payload: showPreciseTemperature
});

export const setIsPhillipsHueEnabled = isPhillipsHueEnabled => ({
  type: types.SET_IS_PHILLIPS_HUE_ENABLED,
  payload: isPhillipsHueEnabled
});
