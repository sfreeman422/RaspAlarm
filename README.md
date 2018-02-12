# RaspAlarm
A MERN Stack, Raspberry Pi Controlled Alarm Clock.
![RaspAlarm](https://github.com/sfreeman422/RaspAlarm/raw/master/Images/cropped.jpg "RaspAlarm")
# Purpose
A full feature alarm clock that can be used in the bedroom to tell the time, set alarms, show the weather and a whole slew of other, yet to be built features. 

# Why?
My girlfriend and I watched a YouTube video about how technology rules people's lives. The guy in the video mentioned that he knows couples who wake up and go through their phones before even saying good morning to each other and that this was "unhealthy". We realized we do exactly that so we thought up a solution to still have some technology in our bedroom but leave our phones in another room. 

# Changelog/Status

## 2/11/16 - Bug Fixes
- Resolved error handling issues when the user chooses not to share their location.
- Many modifications to code to make it more concise and easier to read.
- Added a loading animation.
- Adjusted CSS for smaller resolutions
- Added a new, up to date picture of the clock.

## 9/26/17 - Changes
- Resolved bugs with Auto-brightness feature.
- Added `utilities/chrome-refresh.sh` which can be used to auto-refresh Chrome on the Raspberry Pi whenever the repo is updated. Special thanks to [Silviu Tantos](http://razius.com/articles/auto-refreshing-google-chrome-on-file-changes/) for the script!
- Updated the readme to include information on how to get set with the `utilities/chrome-refresh.sh`

## 9/24/17 - Changes
- Adjusted code to include an auto brightness feature that adjusts brightness on the RaspberryPi as long as the code is in fact running on a Raspberry Pi. This is controlled by modifying `/sys/class/backlight/rpi_backlight/brightness`. 0 is off, 1 is on, and anything from 2-255 increases the brightness. When the software detects that it is in fact night time, it will reduce brightness accordingly. When it is day time, it increases. This relies on the `/sys/class/backlight/rpi_backlight/brightness` file permissions set to 777. Is is also important to note that you must set your environtment variable `isRaspberryPi=true` if you intend on using this on a Raspberry Pi.
- Added the ability for the weather icons to be updated dynamically. If the sun will have set for the weather shown, the icon is updated accordingly. For example, if the sun sets today at 6pm, it is clear out and the current time is 3:40pm, we show a sun icon for 4pm, 5pm, and then, since the sun will set at 6pm, we have a moon icon for 6pm, 7pm and onward.
- Added ESLint support to make code more human readable.

## 4/24/17 - Changes
- Rewritten to ES6
- Added night/day functionality so that the icon will display the proper time of day depending on whether or not it is day or night in your area. 
- Adjusted a number of stylistic components involving how the alarms are shown. Also improved readability of text on some displays. 
- Adjusted the way that the weather and temperature is displayed on the page. 
- Hidden feature to adjust the background as this feature is still in development (Go find it!) 

## Planned Changes 
- Will provide support for per-user alarms in order to make this usable via the web, if someone should want to do that. 
- Will provide support for custom alarm sounds, background images and more!


# Clone/Fork this Repo:
## Prerequisites:
- Node
- Webpack
- MongoDB

## Steps
- Visit https://www.wunderground.com/weather/api/ and sign up for an API Key. 
- Create a folder called private in the root of the repo. Inside of this folder, create keys.js
- Inside of keys.js, create:
```javascript
var keys = "yourKeyFromWeatherUndergroundApi";
module.exports = keys;
```
- Adjust server.js so that your `process.env.isRaspberryPi` is set accordingly. Set to `true` if running on a Raspberry Pi or `false` (or undefined) if not.
- If you are running on a pi, be sure to run `chmod 777 /sys/class/backlight/rpi_backlight/brightness` in order to take advantage of the auto-dim/brighten feature.
- npm install
- webpack
- If you wish to take advantage of `chrome-refresh.sh`, be sure to `chmod +x chrome-refresh.sh` then `bash chrome-refresh.sh /folder/you/want/to/watch`. It is best to use this in conjunction with `nodemon` and `webpack -w` so that any time the files in the repo change, your server refreshes, your webpack refresh and your webpage refreshes.
- Visit localhost:3000 on your browser and enjoy!