const exec = require('child_process').exec;
// Adjusted our backlighting of the raspberry pi
// If it is night, we dim,
// If it is day, we brighten.
module.exports = function adjustBrightness(isNight) {
  if (isNight === 'true') {
    exec('echo 20 > /sys/class/backlight/rpi_backlight/brightness', (error, stdout, stderr) => {
      if (error) {
        console.error(`execError: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr; ${stderr}`);
    });
  } else if (isNight !== 'true') {
    exec('echo 255 > /sys/class/backlight/rpi_backlight/brightness', (error, stdout, stderr) => {
      if (error) {
        console.error(`execError: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr; ${stderr}`);
    });
  }
};
