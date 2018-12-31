import moment from "moment";
import fetch from "isomorphic-fetch";
import * as config from "../private/config";
import * as huePowerSchedule from "../constants/hue-power-schedule";
import * as hueSunColors from "../constants/hue-sun-colors";

export function getUserCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
      },
      error => {
        reject(new Error(`Geolocation failed! \n ${error.message}`));
      },
      { timeout: 30000 }
    );
  });
}

export function getSunData(userCoords) {
  return fetch(
    `https://api.wunderground.com/api/${config.wunderground}/astronomy/q/${
      userCoords.lat
    },${userCoords.long}.json`
  )
    .then(response => response.json())
    .then(sundata => ({
      sunrise: moment(
        `0${sundata.sun_phase.sunrise.hour}:${
          sundata.sun_phase.sunrise.minute
        }am`,
        "hh:mm:a"
      ),
      sunset: moment(
        `0${sundata.sun_phase.sunset.hour - 12}:${
          sundata.sun_phase.sunset.minute
        }pm`,
        "hh:mm:a"
      )
    }))
    .catch(err => {
      throw new Error(`Sunrise/sunset retrieval failed! \n ${err.message}`);
    });
}

export function getUserCity(locationObject) {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
      locationObject.lat
    },${locationObject.long}&sensor=true&key=${config.google_geocode}`
  )
    .then(response => response.json())
    .then(geoloc => {
      if (geoloc.error_message) {
        throw new Error(geoloc.error_message);
      }
      return `${geoloc.results[0].address_components[2].short_name}, ${
        geoloc.results[0].address_components[4].short_name
      }`;
    })
    .catch(err => {
      throw new Error(`Location Refinement Failed! \n Unknown error: ${err}`);
    });
}

export function setBrightness(isNight) {
  fetch("/brightness", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      isNight
    })
  })
    .then(res => res.json())
    .then(resp => console.log(resp))
    .catch(e => console.error(e));
}

export function adjustLighting(time, sunData, day) {
  const formattedTime = moment(time, "hh:mm:a");
  const currentHour = formattedTime.format("hh:00a");
  const formattedSunData = {
    sunrise: moment(sunData.sunrise, "hh:mm:a"),
    sunset: moment(sunData.sunset, "hh:mm:a")
  };
  const { sunrise, sunset } = formattedSunData;
  const timeToSunset =
    Math.floor(formattedTime.diff(sunset, "minutes") / 10) * 10;
  const timeToSunrise =
    Math.floor(formattedTime.diff(sunrise, "minutes") / 10) * 10;
  console.log(timeToSunrise);
  console.log(timeToSunset);
  console.log(typeof timeToSunrise);
  console.log(typeof timeToSunset);
  console.log(timeToSunset < -60);

  const lightRequest = {
    on: huePowerSchedule.default[currentHour][day]
  };

  if (timeToSunset >= -60 && timeToSunset <= 0) {
    lightRequest.color =
      hueSunColors.sunset[Math.abs(timeToSunset).toString()].color;
    lightRequest.saturation =
      hueSunColors.sunset[Math.abs(timeToSunset).toString()].saturation;
    lightRequest.brightness =
      hueSunColors.sunset[Math.abs(timeToSunset).toString()].brightness;
  } else if (timeToSunrise >= -60 && timeToSunrise <= 0) {
    lightRequest.color =
      hueSunColors.sunrise[Math.abs(timeToSunrise).toString()].color;
    lightRequest.saturation =
      hueSunColors.sunrise[Math.abs(timeToSunrise).toString()].saturation;
    lightRequest.brightness =
      hueSunColors.sunset[Math.abs(timeToSunrise).toString()].brightness;
  }
  console.log("lightRequest - ", lightRequest);
}

export function getLightData() {
  return fetch(`http://${config.hue_ip}/api/${config.hue_id}`)
    .then(res => res.json())
    .catch(e => console.error("Error retrieving Phillips Hue Data: ", e));
}
