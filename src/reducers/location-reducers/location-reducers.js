import * as types from "../../actions/action-types";

const initialState = {
  userLoc: "",
  userCoords: {
    lat: 0,
    long: 0
  },
  savedLocations: []
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USERLOC:
      return {
        ...state,
        userLoc: action.payload
      };
    case types.SET_USERCOORDS:
      return {
        ...state,
        userCoords: {
          lat: action.payload.lat,
          long: action.payload.long
        }
      };
    case types.ADD_LOCATION:
      return {
        ...state,
        savedLocations: [...state.savedLocations, action.payload]
      };
    default:
      return state;
  }
};

export default locationReducer;
