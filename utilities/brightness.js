const exec = require('child_process').exec;
const moment = require('moment');
// Adjusted our backlighting of the raspberry pi 
// If it is night, we dim,
// If it is day, we brighten.
module.exports = function adjustBrightness() {
  console.log('Testing brightness');
  let sunrise = moment(this.props.sunrise,"hh:mm:a");
  let sunset = moment(this.props.sunset,"hh:mm:a");
  let currentTime = moment(this.props.currentTime,"hh:mm:a");
  let isNight;
  if((currentTime).isAfter(sunset) || (currentTime).isBefore(sunrise)){
    isNight = true;
  }
  else{
    isNight = false;
  }
  console.log('is night: ' + isNight);
  if (isNight) {
    console.log('Making dimmer..');
    exec('echo 20 > /sys/class/backlight/rpi_backlight/brightness');
  } else {
    console.log('Making brighter..');
    exec('echo 255 > /sys/class/backlight/rpi_backlight/brightness');
  }
}