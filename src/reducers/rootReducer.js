const initialState = {
  time: '',
  date: '',
  today: '',
  userLoc: '',
  savedLocations: [],
  userCoords: {
    lat: 0,
    long: 0,
  },
  locationError: '',
  hasWeatherData: false,
  weatherArr: [],
  sunrise: {},
  sunset: {},
  alarms: [],
  isNight: false,
  loadingMessage: '',
  showDeltas: true,
  celcius: false,
  preciseTemperature: true,
  coloredIcons: true,
  blinkTime: true,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TIME':
      return {
        ...state,
        time: action.payload,
      };
    case 'SET_DATE':
      return {
        ...state,
        date: action.payload,
      };
    case 'SET_WEATHER':
      return {
        ...state,
        weatherArr: action.payload,
      };
    case 'SET_WEATHER_STATUS':
      return {
        ...state,
        hasWeatherData: action.payload,
      };
    case 'SET_USERLOC':
      return {
        ...state,
        userLoc: action.payload,
      };
    case 'SET_USERCOORDS':
      return {
        ...state,
        userCoords: {
          lat: action.payload.lat,
          long: action.payload.long,
        },
      };
    case 'SET_SUNDATA':
      return {
        ...state,
        sunrise: action.payload.sunrise,
        sunset: action.payload.sunset,
      };
    case 'GET_ALARMS':
      return {
        ...state,
        alarms: action.payload,
      };
    case 'SET_NIGHT':
      return {
        ...state,
        isNight: action.payload,
      };
    case 'SET_TODAY':
      return {
        ...state,
        today: action.payload,
      };
    case 'REPORT_ERROR':
      return {
        ...state,
        locationError: action.payload,
      };
    case 'SET_DELTAS':
      return {
        ...state,
        showDeltas: action.payload,
      };
    case 'SET_LOADING_STATUS':
      return {
        ...state,
        loadingMessage: action.payload,
      };
    case 'SHOW_CELCIUS':
      return {
        ...state,
        celcius: action.payload,
      };
    case 'SHOW_COLORED_ICONS':
      return {
        ...state,
        coloredIcons: action.payload,
      };
    case 'ADD_LOCATION':
      return {
        ...state,
        savedLocations: [...state.savedLocations, action.payload],
      };
    case 'SET_BLINK_TIME':
      return {
        ...state,
        blinkTime: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
