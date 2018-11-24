# RaspAlarm
A MERN Stack, Raspberry Pi Controlled Alarm Clock.
![RaspAlarm](https://github.com/sfreeman422/RaspAlarm/raw/master/Images/cropped.jpg "RaspAlarm")
# Purpose
A full feature alarm clock that can be used in the bedroom to tell the time, set alarms, show the weather and a whole slew of other, yet to be built features. 

# Why?
My girlfriend and I watched a YouTube video about how technology rules people's lives. The guy in the video mentioned that he knows couples who wake up and go through their phones before even saying good morning to each other and that this was "unhealthy". We realized we do exactly that so we thought up a solution to still have some technology in our bedroom but leave our phones in another room. 

# Clone/Fork this Repo:
## Prerequisites:
- Node
- React
- MongoDB

## Steps
- Visit https://www.wunderground.com/weather/api/ and sign up for an API Key. 
- Visit https://developers.google.com/maps/documentation/geocoding/get-api-key and sign up for an API key.
- Create src/private/config.json with key `wunderground` that includes your API key for wunderground and `google_geocode` that includes you geocoding api.
- Set up `RaspAlarmMongoDB`, and `isRaspberryPi` as environment variables where RaspAlarmMongoDB is your Mongo instance you would like to use, and isRaspberryPi is a boolean describing whether or not this project is running on a Raspberry Pi.
- If you are running on a Raspberry Pi on Raspbian, be sure to run `chmod 777 /sys/class/backlight/rpi_backlight/brightness` in order to take advantage of the auto-dim/brighten feature.
- `npm install`
- `node server.js`
- `npm run start`
- Visit localhost:3001 on your browser and enjoy!