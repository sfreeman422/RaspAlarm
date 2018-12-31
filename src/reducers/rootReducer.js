const initialState = {
  time: "",
  date: "",
  today: "",
  userLoc: "",
  savedLocations: [],
  userCoords: {
    lat: 0,
    long: 0
  },
  error: undefined,
  weatherArr: [],
  lastTemperature: undefined,
  sunData: {},
  alarms: [],
  isNight: undefined,
  loadingMessage: "",
  showDeltas: true,
  celcius: false,
  preciseTemperature: true,
  coloredIcons: true,
  blinkTime: true,
  initialized: false,
  showPadded: false,
  is24HourClock: false,
  hueData: {}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TIME":
      return {
        ...state,
        time: action.payload
      };
    case "SET_DATE":
      return {
        ...state,
        date: action.payload
      };
    case "SET_WEATHER":
      return {
        ...state,
        weatherArr: action.payload
      };
    case "SET_USERLOC":
      return {
        ...state,
        userLoc: action.payload
      };
    case "SET_USERCOORDS":
      return {
        ...state,
        userCoords: {
          lat: action.payload.lat,
          long: action.payload.long
        }
      };
    case "SET_SUNDATA":
      return {
        ...state,
        sunData: action.payload
      };
    case "GET_ALARMS":
      return {
        ...state,
        alarms: action.payload
      };
    case "SET_NIGHT":
      return {
        ...state,
        isNight: action.payload
      };
    case "SET_TODAY":
      return {
        ...state,
        today: action.payload
      };
    case "REPORT_ERROR":
      return {
        ...state,
        error: action.payload
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: undefined
      };
    case "SET_DELTAS":
      return {
        ...state,
        showDeltas: action.payload
      };
    case "SET_LOADING_STATUS":
      return {
        ...state,
        loadingMessage: action.payload
      };
    case "SHOW_CELCIUS":
      return {
        ...state,
        celcius: action.payload
      };
    case "SHOW_COLORED_ICONS":
      return {
        ...state,
        coloredIcons: action.payload
      };
    case "ADD_LOCATION":
      return {
        ...state,
        savedLocations: [...state.savedLocations, action.payload]
      };
    case "SET_BLINK_TIME":
      return {
        ...state,
        blinkTime: action.payload
      };
    case "SET_SHOW_PADDED":
      return {
        ...state,
        showPadded: action.payload
      };
    case "SET_LAST_TEMPERATURE":
      return {
        ...state,
        lastTemperature: action.payload
      };
    case "SET_INITIALIZED":
      return {
        ...state,
        initialized: action.payload
      };
    case "SET_IS_24_HOUR_CLOCK":
      return {
        ...state,
        is24HourClock: action.payload
      };
    case "SET_HUE_DATA":
      return {
        ...state,
        hueData: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
