const initialState = {
  time: '',
  date: '',
  today: '',
  userLoc: '',
  locationError: '',
  weatherArr: [],
  sunrise: '',
  sunset: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADJUST_DATETIME':
      return {
        ...state,
        time: action.payload.time,
        date: action.payload.date,
      };
    case 'GET_WEATHER':
      return {
        ...state,
        weatherArr: [...state, action.payload],
      };
    case 'GET_USERLOC':
      return {
        ...state,
        userLoc: action.payload,
      };
    case 'ADJUST_SUNDATA':
      return {
        ...state,
        sunrise: action.payload.sunrise,
        sunset: action.payload.sunset,
      };
    default:
      return state;
  }
};

export default rootReducer;
