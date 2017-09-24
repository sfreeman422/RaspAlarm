const exec = require('child_process').exec;
const moment = require('moment');
// Adjusted our backlighting of the raspberry pi 
// If it is night, we dim,
// If it is day, we brighten.
module.exports = function adjustBrightness(isNight) {
  console.log('Testing brightness');
  console.log('is night: ' + isNight);
  if (isNight) {
    console.log('Making dimmer..');
    exec('echo 20 > /sys/class/backlight/rpi_backlight/brightness');
  } else if (!isNight) {
    console.log('Making brighter..');
    exec('echo 255 > /sys/class/backlight/rpi_backlight/brightness');
  }
}