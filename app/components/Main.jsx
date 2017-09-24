import React from 'react';
import moment from 'moment';

// Require the children
import Clock from './Children/Clock.jsx';
import Today from './Children/Today.jsx';
import Weather from './Children/Weather.jsx';
import Alarm from './Children/Alarm.jsx';
import AlarmManager from './AlarmManager.jsx';

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
  }
  // Gets the time for the alarm clock.
  getTime() {
    this.setState({
      time: moment().format('hh:mm' + 'a'),
      date: moment().format('MMMM Do YYYY'),
      today: moment().format('dddd'),
    });
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
  componentDidMount() {
    this.locationThenWeather();
    this.getTime();
    // Runs the locationThenWeather function every 60 seconds.
    // We do this to avoid 6 API calls within the one minute in which we are at a :00 time.
    weatherInterval = setInterval(this.locationThenWeather, 60000);
    // Get the time every 1/10 of a second
    // This will also setState for time to the current time.
    timeInterval = setInterval(this.getTime, 100);
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
            todayPic={this.state.weatherTodayPic}
            todayTemp={this.state.weatherTodayTemp}
            one={this.state.weatherHourOne}
            oneHour={this.state.weatherHourOneTime}
            oneTemp={this.state.weatherHourOneTemp}
            onePic={this.state.weatherHourOnePic}
            two={this.state.weatherHourTwo}
            twoHour={this.state.weatherHourTwoTime}
            twoTemp={this.state.weatherHourTwoTemp}
            twoPic={this.state.weatherHourTwoPic}
            three={this.state.weatherHourThree}
            threeHour={this.state.weatherHourThreeTime}
            threeTemp={this.state.weatherHourThreeTemp}
            threePic={this.state.weatherHourThreePic}
            four={this.state.weatherHourFour}
            fourHour={this.state.weatherHourFourTime}
            fourTemp={this.state.weatherHourFourTemp}
            fourPic={this.state.weatherHourFourPic}
            five={this.state.weatherHourFive}
            fiveHour={this.state.weatherHourFiveTime}
            fiveTemp={this.state.weatherHourFiveTemp}
            fivePic={this.state.weatherHourFivePic}
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
