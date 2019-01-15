import { combineReducers } from "redux";
import applicationStateReducer from "./application-state-reducers/application-state-reducer";
import dateTimeReducer from "./date-time-reducers/date-time-reducer";
import locationReducer from "./location-reducers/location-reducers";
import userOptionsReducer from "./user-options-reducers/user-options-reducers";
import weatherSunReducer from "./weather-sun-reducers/weather-sun-reducers";

const rootReducer = combineReducers({
  applicationState: applicationStateReducer,
  userOptions: userOptionsReducer,
  location: locationReducer,
  weather: weatherSunReducer,
  dateTime: dateTimeReducer
});

export default rootReducer;
