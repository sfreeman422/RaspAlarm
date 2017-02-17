# RaspAlarm
A Raspberry Pi Controlled Alarm Clock.

# Purpose
A full feature alarm clock that can be used in the bedroom to tell the time, set alarms, show the weather and a whole slew of other, yet to be built features. 

# Why?
My girlfriend and I watched a YouTube video about how technology rules people's lives. The guy in the video mentioned that he knows couples who wake up and go through their phones before even saying good morning to each other and that this was "unhealthy". We realized we do exactly that so we thought up a solution to still have some technology in our bedroom but leave our phones in another room. 

# Technologies Used
- NodeJS
- React
- MongoDB
- Express
- Weather Underground API

# Struggles
This application is still under development.
- Promises were really hard to learn but a necessity in order to get async code to work properly. In my case, getting the user's location before making an API call for the weather. 
- The Raspberry Pi is throwing an "undervoltage" symbol, indicating that my power supply probably isn't enough. Plan to fix this by buying a new power supply, but will slog through for the time being. RESOLVED: Purchased a new power cable in February that was designed for use with the Raspberry Pi. 

# What I Learned
Raspberry Pi's are cool, fun and cheap. This is my first Raspberry Pi project but will likely not be my last. 

Promises are hard! I had to consult a friend of mine to help me implement promises within my React lifecycle methods. I needed to be able to get the user's location and THEN get the weather for that location. It took me a few hours of messing about and consulting my friend on what I was doing wrong, but finally, we are getting the user's location THEN getting the weather. 

# Status
2/15/17
- Beta version! This was presented at the Rutgers Coding Bootcamp Demo Day in the state shown below. All weather and alarm clock features are working properly and I am now working to integrate Amazon's Echo API. The case is an alpha version of the final case as I'd like to go for something a bit more sleek. Perhaps stained wood. 
![Beta Buid](https://github.com/sfreeman422/RaspAlarm/blob/master/Images/beta.jpg)

2/4/17
- We have lift off! Below is a picture of the "alpha" version of the alarm. We see that we have the time displaying properly, icons for weather and a couple hours 
forecast for weather. I had to change over to the Weather Underground's API as I was originally using OpenWeaterMap but found that they did not provide me with an hourly forecast. Next steps are to integrate an alarm feature as well as Alexa integrations. 
![Alpha Build](https://github.com/sfreeman422/RaspAlarm/blob/master/Images/alpha.jpg)

January 2017
- Raspberry Pi and touch screen are functional and running Raspbian. 
![It's alive](https://github.com/sfreeman422/RaspAlarm/blob/master/Images/IMG_20170107_160419.jpg)
