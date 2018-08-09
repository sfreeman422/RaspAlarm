export const weatherArr = [
  {
    icon: 'wi wi-day-snow',
    temp: {
      english: {
        raw: 70,
        display: '70F',
      },
      metric: {
        raw: 20,
        display: '20C',
      },
    },
    condition: 'Snow',
    time: '7:00am',
  },
  {
    icon: 'wi wi-day-rain',
    temp: {
      english: {
        raw: 69,
        display: '69F',
      },
      metric: {
        raw: 19,
        display: '19C',
      },
    },
    condition: 'Rain',
    time: '8:00am',
  },
  {
    icon: 'wi wi-day-rain',
    temp: {
      english: {
        raw: 68,
        display: '68F',
      },
      metric: {
        raw: 19,
        display: '19C',
      },
    },
    condition: 'Rain',
    time: '9:00am',
  },
  {
    icon: 'wi wi-day-rain',
    temp: {
      english: {
        raw: 67,
        display: '67F',
      },
      metric: {
        raw: 18,
        display: '18C',
      },
    },
    condition: 'Rain',
    time: '10:00am',
  },
  {
    icon: 'wi wi-day-rain',
    temp: {
      english: {
        raw: 67,
        display: '67F',
      },
      metric: {
        raw: 18,
        display: '18C',
      },
    },
    condition: 'Rain',
    time: '11:00am',
  },
];

export const mockStore = {
  time: '7:00am',
  date: 'August 1, 2018',
  today: 'Monday',
  userLoc: 'Test, Test',
  savedLocations: [],
  userCoords: {
    lat: 0,
    long: 0,
  },
  locationError: '',
  weatherArr,
  lastTemperature: undefined,
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
  initialized: false,
};
