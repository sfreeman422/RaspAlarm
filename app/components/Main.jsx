import React from 'react';
import moment from 'moment';

// Require the children
import Clock from './Children/Clock.jsx';
import Today from './Children/Today.jsx';
import Weather from './Children/Weather.jsx';
import Alarm from './Children/Alarm.jsx';

let hasWeatherData = false;
let weatherInterval;
let timeInterval;
const keys = require('../../private/keys.js');

// Vars to save state.
let timeSave = 'Loading...';
let dateSave = 'Loading...';
let todaySave = 'Loading...';
let userLocSave = 'Loading...';
let nextAlarmSave = 'Loading...';
let alarmSave = 'Loading...';
let weatherTodaySave = 'Loading...';
let weatherTodayTimeSave = 'Loading...';
let weatherTodayTempSave = 'Loading...';
let weatherTodayPicSave;
let weatherHourOneSave = 'Loading...';
let weatherHourOneTimeSave = 'Loading...';
let weatherHourOneTempSave = 'Loading...';
let weatherHourOnePicSave;
let weatherHourTwoSave = 'Loading...';
let weatherHourTwoTimeSave = 'Loading...';
let weatherHourTwoTempSave = 'Loading...';
let weatherHourTwoPicSave;
let weatherHourThreeSave = 'Loading...';
let weatherHourThreeTimeSave = 'Loading...';
let weatherHourThreeTempSave = 'Loading...';
let weatherHourThreePicSave;
let weatherHourFourSave = 'Loading...';
let weatherHourFourTimeSave = 'Loading...';
let weatherHourFourTempSave = 'Loading...';
let weatherHourFourPicSave;
let weatherHourFiveSave = 'Loading...';
let weatherHourFiveTimeSave = 'Loading...';
let weatherHourFiveTempSave = 'Loading...';
let weatherHourFivePicSave;
let sunriseSave;
let sunsetSave;
let isNight;
let oldIsNight;

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      time: timeSave,
      date: dateSave,
      today: todaySave,
      userLoc: userLocSave,
      nextAlarm: nextAlarmSave,
      alarm: alarmSave,
      weatherToday: weatherTodaySave,
      weatherTodayTime: weatherTodayTimeSave,
      weatherTodayTemp: weatherTodayTempSave,
      weatherTodayPic: weatherTodayPicSave,
      weatherHourOne: weatherHourOneSave,
      weatherHourOneTime: weatherHourOneTimeSave,
      weatherHourOneTemp: weatherHourOneTempSave,
      weatherHourOnePic: weatherHourOnePicSave,
      weatherHourTwo: weatherHourTwoSave,
      weatherHourTwoTime: weatherHourTwoTimeSave,
      weatherHourTwoTemp: weatherHourTwoTempSave,
      weatherHourTwoPic: weatherHourTwoPicSave,
      weatherHourThree: weatherHourThreeSave,
      weatherHourThreeTime: weatherHourThreeTimeSave,
      weatherHourThreeTemp: weatherHourThreeTempSave,
      weatherHourThreePic: weatherHourThreePicSave,
      weatherHourFour: weatherHourFourSave,
      weatherHourFourTime: weatherHourFourTimeSave,
      weatherHourFourTemp: weatherHourFourTempSave,
      weatherHourFourPic: weatherHourFourPicSave,
      weatherHourFive: weatherHourFiveSave,
      weatherHourFiveTime: weatherHourFiveTimeSave,
      weatherHourFiveTemp: weatherHourFiveTempSave,
      weatherHourFivePic: weatherHourFivePicSave,
      sunrise: sunriseSave,
      sunset: sunsetSave,
    };
    this.getTime = this.getTime.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.locationThenWeather = this.locationThenWeather.bind(this);
    this.determineWeatherIcon = this.determineWeatherIcon.bind(this);
    this.adjustBrightness = this.adjustBrightness.bind(this);
  }
  componentDidMount() {
    this.locationThenWeather();
    this.getTime();
    // Runs the locationThenWeather function every 60 seconds.
    // We do this to avoid 6 API calls within the one minute in which we are at a :00 time.
    weatherInterval = setInterval(this.locationThenWeather, 60000);
    // Get the time every 1/10 of a second
    // This will also setState for time to the current time.
    timeInterval = setInterval(this.getTime, 100);
    this.adjustBrightness();
  }
  componentWillUnmount() {
    timeSave = this.state.time;
    dateSave = this.state.date;
    todaySave = this.state.today;
    userLocSave = this.state.userLoc;
    nextAlarmSave = this.state.nextAlarm;
    alarmSave = this.state.alarm;
    weatherTodaySave = this.state.weatherToday;
    weatherTodayTimeSave = this.state.weatherTodayTime;
    weatherTodayTempSave = this.state.weatherTodayTemp;
    weatherTodayPicSave = this.state.weatherTodayPic;
    weatherHourOneSave = this.state.weatherHourOne;
    weatherHourOneTimeSave = this.state.weatherHourOneTime;
    weatherHourOneTempSave = this.state.weatherHourOneTemp;
    weatherHourOnePicSave = this.state.weatherHourOnePic;
    weatherHourTwoSave = this.state.weatherHourTwo;
    weatherHourTwoTimeSave = this.state.weatherHourTwoTime;
    weatherHourTwoTempSave = this.state.weatherHourTwoTemp;
    weatherHourTwoPicSave = this.state.weatherHourTwoPic;
    weatherHourThreeSave = this.state.weatherHourThree;
    weatherHourThreeTimeSave = this.state.weatherHourThreeTime;
    weatherHourThreeTempSave = this.state.weatherHourThreeTemp;
    weatherHourThreePicSave = this.state.weatherHourThreePic;
    weatherHourFourSave = this.state.weatherHourFour;
    weatherHourFourTimeSave = this.state.weatherHourFourTime;
    weatherHourFourTempSave = this.state.weatherHourFourTemp;
    weatherHourFourPicSave = this.state.weatherHourFourPic;
    weatherHourFiveSave = this.state.weatherHourFive;
    weatherHourFiveTimeSave = this.state.weatherHourFiveTime;
    weatherHourFiveTempSave = this.state.weatherHourFiveTemp;
    weatherHourFivePicSave = this.state.weatherHourFivePic;
    sunsetSave = this.state.sunset;
    sunriseSave = this.state.sunrise;
    clearInterval(weatherInterval);
    clearInterval(timeInterval);
  }
    // Gets the time for the alarm clock.
  getTime() {
    this.setState({
      time: moment().format('hh:mm' + 'a'),
      date: moment().format('MMMM Do YYYY'),
      today: moment().format('dddd'),
    });
    if (this.state.time === this.state.sunset) {
      isNight = true;
      this.adjustBrightness();
    }
    if (this.state.time === this.state.sunrise) {
      isNight = false;
      this.adjustBrightness();
    }
  }
  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        return resolve(location);
      }, error => reject(error));
    });
  }
  locationThenWeather() {
    const currentMinute = moment().format('mm');
    // If the current time isnt an o'clock or if weather data isnt already included,
    // we run the code to get location and get the weather forecast.
    if (currentMinute === '00' || hasWeatherData === false) {
      return new Promise((resolve, reject) => this.getLocation().then((locationObject) => {
        if (!locationObject) {
          const error = 'Location was undefined!';
          return reject(error);
        }
        // Makes the API call to weatherunderground, then assigns
        // forecast, time and weather icon data to the corresponding states.
        $.ajax({
          url: `https://api.wunderground.com/api/${keys.wunderground}/hourly/q/${locationObject.lat},${locationObject.long}.json`,
        }).done((response) => {
          this.setState({
            weatherToday: response.hourly_forecast[0].condition,
            weatherTodayTime: response.hourly_forecast[0].FCTTIME.civil,
            weatherTodayTemp: `${response.hourly_forecast[0].temp.english}F`,
            weatherTodayPic: response.hourly_forecast[0].icon,
            weatherHourOne: response.hourly_forecast[1].condition,
            weatherHourOneTime: response.hourly_forecast[1].FCTTIME.civil,
            weatherHourOneTemp: `${response.hourly_forecast[1].temp.english}F`,
            weatherHourOnePic: response.hourly_forecast[1].icon,
            weatherHourTwo: response.hourly_forecast[2].condition,
            weatherHourTwoTime: response.hourly_forecast[2].FCTTIME.civil,
            weatherHourTwoTemp: `${response.hourly_forecast[2].temp.english}F`,
            weatherHourTwoPic: response.hourly_forecast[2].icon,
            weatherHourThree: response.hourly_forecast[3].condition,
            weatherHourThreeTime: response.hourly_forecast[3].FCTTIME.civil,
            weatherHourThreeTemp: `${response.hourly_forecast[3].temp.english}F`,
            weatherHourThreePic: response.hourly_forecast[3].icon,
            weatherHourFour: response.hourly_forecast[4].condition,
            weatherHourFourTime: response.hourly_forecast[4].FCTTIME.civil,
            weatherHourFourTemp: `${response.hourly_forecast[4].temp.english}F`,
            weatherHourFourPic: response.hourly_forecast[4].icon,
            weatherHourFive: response.hourly_forecast[5].condition,
            weatherHourFiveTime: response.hourly_forecast[5].FCTTIME.civil,
            weatherHourFiveTemp: `${response.hourly_forecast[1].temp.english}F`,
            weatherHourFivePic: response.hourly_forecast[5].icon,
          });
          hasWeatherData = true;
        });
        // Gets the location from the reverse geocode api provided by Google.
        // This enables us to show the actual name of the location that the user is in.
        $.ajax({
          url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationObject.lat},${locationObject.long}&sensor=true`,
        }).done((geoloc) => {
          this.setState({
            userLoc: `${geoloc.results[0].address_components[2].short_name}, ${geoloc.results[0].address_components[4].short_name}`,
          });
        });
        // Get the sunrise/sunset data
        $.ajax({
          url: `https://api.wunderground.com/api/${keys.wunderground}/astronomy/q/${locationObject.lat},${locationObject.long}.json`,
        }).done((sundata) => {
          const sunriseString = `0${sundata.sun_phase.sunrise.hour}:${sundata.sun_phase.sunrise.minute}am`;
          const sunsetString = `0${sundata.sun_phase.sunset.hour - 12}:${sundata.sun_phase.sunset.minute}pm`;
          const sunriseMoment = moment(sunriseString, 'hh:mm:a');
          const sunsetMoment = moment(sunsetString, 'hh:mm:a');
          this.setState({
            sunrise: sunriseMoment,
            sunset: sunsetMoment,
          });
        });
        return resolve(locationObject);
      }).catch(error => reject(error)));
    }
  }
  adjustBrightness() {
    if (oldIsNight !== isNight && isNight !== undefined) {
      console.log('old:' + oldIsNight);
      console.log('new:' + isNight);
      $.ajax({
        url: '/brightness',
        type: 'post',
        data: {
          isNight,
        },
      }).done((response) => {
        console.log(response);
      });
      oldIsNight = isNight;
    }
  }
  determineWeatherIcon(weatherState, hour) {
    const sunrise = moment(this.state.sunrise, 'hh:mm:a');
    const sunset = moment(this.state.sunset, 'hh:mm:a');
    const currentTime = moment(this.state.time, 'hh:mm:a');
    const isHour = moment(hour, 'hh:mm:a');
    let isHourNight;
    if ((currentTime).isAfter(sunset) || (currentTime).isBefore(sunrise)) {
      isNight = true;
      if (isNight !== oldIsNight) {
        this.adjustBrightness();
      }
    } else {
      isNight = false;
      if (isNight !== oldIsNight) {
        this.adjustBrightness();
      }
    }
    if ((isHour).isAfter(sunset) || (isHour).isBefore(sunrise)) {
      isHourNight = true;
    } else {
      isHourNight = false;
    }
    if (weatherState === 'chanceflurries') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'chancerain') {
      if (isHourNight === false) return 'wi wi-day-rain';
      return 'wi wi-night-rain';
    } else if (weatherState === 'chancesleet') {
      if (isHourNight === false) return 'wi wi-day-sleet';
      return 'wi wi-night-sleet';
    } else if (weatherState === 'chancesnow') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'chancestorms' || weatherState === 'chancetstorms') {
      if (isHourNight === false) return 'wi wi-day-sprinkle';
      return 'wi wi-night-sprinkle';
    } else if (weatherState === 'clear') {
      if (isHourNight === false) return 'wi wi-day-sunny';
      return 'wi wi-night-clear';
    } else if (weatherState === 'cloudy') {
      return 'wi wi-cloud';
    } else if (weatherState === 'flurries') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'fog') {
      if (isHourNight === false) return 'wi wi-day-fog';
      return 'wi wi-night-fog';
    } else if (weatherState === 'hazy') {
      return 'wi wi-day-haze';
    } else if (weatherState === 'mostlycloudy') {
      if (isHourNight === false) return 'wi wi-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'mostlysunny') {
      if (isHourNight === false) return 'wi wi-day-sunny-overcast';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlycloudy') {
      if (isHourNight === false) return 'wi wi-day-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlysunny') {
      if (isHourNight === false) return 'wi wi-day-sunny-overcast';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'sleet') {
      if (isHourNight === false) return 'wi wi-day-sleet';
      return 'wi wi-night-sleet';
    } else if (weatherState === 'rain') {
      if (isHourNight === false) return 'wi wi-day-rain';
      return 'wi wi-night-rain';
    } else if (weatherState === 'snow') {
      if (isHourNight === false) return 'wi wi-day-snow';
      return 'wi wi-night-snow';
    } else if (weatherState === 'sunny') {
      if (isHourNight === false) return 'wi wi-day-sunny';
      return 'wi wi-night-clear';
    } else if (weatherState === 'tstorms') {
      if (isHourNight === false) return 'wi wi-day-storm-showers';
      return 'wi wi-night-alt-storm-showers';
    } else if (weatherState === 'unknown') {
      if (isHourNight === false) return 'wi wi-day-cloudy-high';
      return 'wi wi-stars';
    } else if (weatherState === 'cloudy') {
      if (isHourNight === false) return 'wi wi-day-cloudy';
      return 'wi wi-night-alt-cloudy';
    } else if (weatherState === 'partlycloudy') {
      if (isHourNight === false) return 'wi wi-day';
      return 'wi wi-night-alt-cloudy';
    }
    return 'wi wi-na';
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <Clock time={this.state.time} />
        </div>
        <div className="row">
          <Today date={this.state.date} userLoc={this.state.userLoc} day={this.state.today} />
        </div>
        <div className="row">
          <Weather
            currentTime={this.state.time}
            today={this.state.weatherToday}
            todayHour={this.state.weatherTodayTime}
            todayPic={this.determineWeatherIcon(this.state.weatherTodayPic, this.state.weatherTodayTime)}
            todayTemp={this.state.weatherTodayTemp}
            one={this.state.weatherHourOne}
            oneHour={this.state.weatherHourOneTime}
            oneTemp={this.state.weatherHourOneTemp}
            onePic={this.determineWeatherIcon(this.state.weatherHourOnePic, this.state.weatherHourOneTime)}
            two={this.state.weatherHourTwo}
            twoHour={this.state.weatherHourTwoTime}
            twoTemp={this.state.weatherHourTwoTemp}
            twoPic={this.determineWeatherIcon(this.state.weatherHourTwoPic, this.state.weatherHourTwoTime)}
            three={this.state.weatherHourThree}
            threeHour={this.state.weatherHourThreeTime}
            threeTemp={this.state.weatherHourThreeTemp}
            threePic={this.determineWeatherIcon(this.state.weatherHourThreePic, this.state.weatherHourThreeTime)}
            four={this.state.weatherHourFour}
            fourHour={this.state.weatherHourFourTime}
            fourTemp={this.state.weatherHourFourTemp}
            fourPic={this.determineWeatherIcon(this.state.weatherHourFourPic, this.state.weatherHourFourTime)}
            five={this.state.weatherHourFive}
            fiveHour={this.state.weatherHourFiveTime}
            fiveTemp={this.state.weatherHourFiveTemp}
            fivePic={this.determineWeatherIcon(this.state.weatherHourFivePic, this.state.weatherHourFiveTime)}
            sunrise={this.state.sunrise}
            sunset={this.state.sunset}
          />
        </div>
        <div className="row">
          <Alarm currentTime={this.state.time} />
        </div>
      </div>);
  }
}
