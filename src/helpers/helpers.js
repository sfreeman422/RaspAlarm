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

  const lightRequest = {
    state: {
      on: huePowerSchedule.default[currentHour][day]
    }
  };
  const formattedTimeToSunset = Math.abs(timeToSunset).toString();
  const formattedTimeToSunrise = Math.abs(timeToSunrise).toString();
  if (timeToSunset >= -60 && timeToSunset <= 0) {
    lightRequest.state.hue = hueSunColors.sunset[formattedTimeToSunset].hue;
    lightRequest.state.sat = hueSunColors.sunset[formattedTimeToSunset].sat;
    lightRequest.state.bri = hueSunColors.sunset[formattedTimeToSunset].bri;
  } else if (timeToSunrise >= -60 && timeToSunrise <= 0) {
    lightRequest.hue = hueSunColors.sunrise[formattedTimeToSunrise].hue;
    lightRequest.state.sat = hueSunColors.sunrise[formattedTimeToSunrise].sat;
    lightRequest.state.bri = hueSunColors.sunset[formattedTimeToSunrise].bri;
  }
  console.log("lightRequest - ", lightRequest);
  // fetch(`http://${config.hue_ip}/api/${config.hue_id}/groups/0/action`, { method: 'PUT', body: JSON.stringify(lightRequest) }).then(res => console.log(res.json())).catch(e => console.error(e));
}

export function getLightData() {
  return fetch(`http://${config.hue_ip}/api/${config.hue_id}`)
    .then(res => res.json())
    .catch(e => console.error("Error retrieving Phillips Hue Data: ", e));
}
