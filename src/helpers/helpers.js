import moment from "moment";
import fetch from "isomorphic-fetch";
import * as config from "../private/config";
import * as huePowerSchedule from "../constants/hue-power-schedule";
import * as hueColors from "../constants/hue-colors";

/**
 * Gets the longitude and latitude of the user's current position.
 *
 * @returns { lat: number, long: number}
 */
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

/**
 * Gets the sunrise and sunset data for the user's current position.
 * Formats the time as a string.
 *
 * @export
 * @param {*} userCoords - The users current position { lat: number, long: number}
 * @returns sunData { sunrise: string, sunset: string }
 */
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

/**
 * Gets the user's city location based on latitude and longitude.
 *
 * @export
 * @param {*} locationObject - { long: number, lat: number }
 * @returns City, State/Country
 */
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

/**
 * Makes an HTTP request to change the brightness of the Raspberry Pi.
 *
 * @param {*} isNight
 */
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

export function shouldBeOn(scheduleArray, groups) {
  const time = moment();
  const formattedTime = moment(time, "hh:mm:a");
  let returnVal = true;
  for (let i = 0; i < scheduleArray.length; i += 1) {
    const start = moment(scheduleArray[i].start, "hh:mm:a");
    const end = moment(scheduleArray[i].end, "hh:mm:a");
    if (
      formattedTime.isBetween(start, end) &&
      groups.some(group => scheduleArray[i].groups.includes(group))
    ) {
      returnVal = false;
    }
  }
  return returnVal;
}

export function getLightRequest(sunData, day, groups) {
  const { sunrise, sunset } = sunData;
  const rawTime = moment();
  const time = moment(rawTime, "hh:mm:a");
  const timeToSunset = Math.floor(time.diff(sunset, "minutes") / 10) * 10;
  const timeToSunrise = Math.floor(time.diff(sunrise, "minutes") / 10) * 10;
  const formattedTimeToSunset = Math.abs(timeToSunset).toString();
  const formattedTimeToSunrise = Math.abs(timeToSunrise).toString();
  const withinOneHourOfSunset = timeToSunset >= -60 && timeToSunset <= 0;
  const withinOneHourOfSunrise = timeToSunrise >= -60 && timeToSunrise <= 0;
  const lightRequest = {
    on: shouldBeOn(huePowerSchedule.default[day].off, groups)
  };
  const isDay = time.isAfter(sunrise) && time.isBefore(sunset);
  const isNight = time.isBefore(sunrise) && time.isAfter(sunset);
  if (withinOneHourOfSunset) {
    lightRequest.ct = hueColors.sunset[formattedTimeToSunset].ct;
    lightRequest.bri = hueColors.sunset[formattedTimeToSunset].bri;
  } else if (withinOneHourOfSunrise) {
    lightRequest.ct = hueColors.sunrise[formattedTimeToSunrise].ct;
    lightRequest.bri = hueColors.sunset[formattedTimeToSunrise].bri;
  } else if (isDay) {
    lightRequest.ct = hueColors.day.ct;
    lightRequest.bri = hueColors.day.bri;
  } else if (isNight) {
    lightRequest.ct = hueColors.night.ct;
    lightRequest.bri = hueColors.night.bri;
  }
  console.log("lightRequest - ", lightRequest);
  for (let i = 0; i < groups.length; i += 1) {
    changeLightingByGroup(lightRequest, groups[i]);
  }
}

export function changeLightingByGroup(lightConfig, group) {
  fetch(`http://${config.hue_ip}/api/${config.hue_id}/groups/${group}/action`, {
    method: "PUT",
    body: JSON.stringify(lightConfig)
  })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(e => console.error(e));
}

/**
 * Gets data about the user's Phillip's Hue Configuration.
 *
 * @export
 * @returns Phillips Hue Data: https://developers.meethue.com/develop/hue-api/7-configuration-api/
 */
export function getLightData() {
  return fetch(`http://${config.hue_ip}/api/${config.hue_id}`)
    .then(res => res.json())
    .catch(e => console.error("Error retrieving Phillips Hue Data: ", e));
}
