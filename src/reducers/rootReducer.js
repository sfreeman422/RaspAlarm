const initialState = {
  time: '',
  date: '',
  today: '',
  userLoc: '',
  userCoords: '',
  locationError: '',
  hasWeatherData: false,
  weatherArr: [],
  sunrise: '',
  sunset: '',
  alarms: [],
  isNight: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADJUST_TIME':
      return {
        ...state,
        time: action.payload,
      };
    case 'ADJUST_DATE':
      return {
        ...state,
        date: action.payload,
      };
    case 'ADJUST_WEATHER':
      return {
        ...state,
        weatherArr: action.payload,
      };
    case 'ADJUST_WEATHER_STATUS':
      return {
        ...state,
        hasWeatherData: action.payload,
      };
    case 'ADJUST_USERLOC':
      return {
        ...state,
        userLoc: action.payload,
      };
    case 'ADJUST_USERCOORDS':
      return {
        ...state,
        userCoords: {
          lat: action.payload.lat,
          long: action.payload.long,
        },
      };
    case 'ADJUST_SUNDATA':
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
    case 'ADJUST_NIGHT':
      return {
        ...state,
        isNight: action.payload,
      };
    case 'ADJUST_TODAY':
      return {
        ...state,
        today: action.payload,
      };
    case 'REPORT_ERROR':
      return {
        ...state,
        locationError: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
