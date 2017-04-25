# RaspAlarm
A MERN Stack, Raspberry Pi Controlled Alarm Clock.
![RaspAlarm](https://github.com/sfreeman422/RaspAlarm/blob/master/Images/beta.jpg)
# Purpose
A full feature alarm clock that can be used in the bedroom to tell the time, set alarms, show the weather and a whole slew of other, yet to be built features. 

# Why?
My girlfriend and I watched a YouTube video about how technology rules people's lives. The guy in the video mentioned that he knows couples who wake up and go through their phones before even saying good morning to each other and that this was "unhealthy". We realized we do exactly that so we thought up a solution to still have some technology in our bedroom but leave our phones in another room. 

# Changelog/Status

## 4/24/17 - Recent Changes
- Rewritten to ES6
- Added night/day functionality so that the icon will display the proper time of day depending on whether or not it is day or night in your area. 
- Adjusted a number of stylistic components involving how the alarms are shown. Also improved readability of text on some displays. 
- Adjusted the way that the weather and temperature is displayed on the page. 
- Hidden feature to adjust the background as this feature is still in development (Go find it!) 

## Planned Changes 
- Will provide support for per-user alarms in order to make this usable via the web, if someone should want to do that. 
- Will provide support for custom alarm sounds, background images and more!


# Fork this Repo:
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
- npm install
- webpack
- Visit localhost:3000 on your browser and enjoy!

# What I Learned
Raspberry Pi's are cool, fun and cheap. This is my first Raspberry Pi project but will likely not be my last. 