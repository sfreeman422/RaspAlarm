import moment from "moment";
import fetch from "isomorphic-fetch";
import * as config from "../private/config";

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

export function getData(url, errorHandler = e => console.log(e)) {
  return fetch(url)
    .then(res => res.json())
    .catch(e => errorHandler(e));
}

/**
 * Generates an array of the numeric id's of each group from Phillip's Hue Bridge.
 * Note: We have to parseInt here because the Bridge API returns stringified values.
 * @param {*} lightData
 * @returns
 */
function generateGroupValues(lightData) {
  const groups = [];
  Object.keys(lightData).forEach(key => {
    groups.push(parseInt(key));
  });
  return groups;
}

/**
 * Determines what percentage of our target brightness/ct we should show.
 *
 * @param {*} timeTo - Time to either bedTime, sunrise, or sunset.
 * @param {*} visual - The ct or brightness number that we are concerned with.
 * @returns The integer value of the visual * the percentage of the hour we are close to.
 */
function getLightGradientColor(timeTo, visual) {
  if (timeTo === 0) {
    return Math.floor(visual);
  } else {
    const percentAwayFromTime = 1 - Math.floor(timeTo / 60);
    return Math.floor(visual * percentAwayFromTime);
  }
}

export async function getLightRequest(sunData, day) {
  const { sunrise, sunset } = sunData;
  const lightData = await getLightData();
  const lightGroups = generateGroupValues(lightData.groups);
  const lightSchedule = await getData(`/lights/${day}`);
  console.log(lightSchedule);
  const bedTime = moment(lightSchedule.bedtime, "hh:mm:a");
  const rawTime = moment();
  const time = moment(rawTime, "hh:mm:a");
  const timeToSunset = Math.floor(time.diff(sunset, "minutes"));
  const timeToSunrise = Math.floor(time.diff(sunrise, "minutes"));
  const timeToBed = Math.floor(time.diff(bedTime, "minutes"));
  const withinOneHourOfSunset = timeToSunset > -60 && timeToSunset <= 0;
  const withinOneHourOfSunrise = timeToSunrise > -60 && timeToSunrise <= 0;
  const withinOneHourOfBedTime = timeToBed > -60 && timeToBed <= 0;
  const isDay = time.isAfter(sunrise) && time.isBefore(sunset);
  const isNight = time.isBefore(sunrise) || time.isAfter(sunset);
  const lightRequest = {
    on: shouldBeOn(lightSchedule.off, lightGroups)
  };

  // This is so gnar fix this wtf.
  if (withinOneHourOfSunset) {
    const absTimeToSunset = Math.abs(timeToSunset);
    lightRequest.ct = getLightGradientColor(
      absTimeToSunset,
      lightSchedule.colors.sunset.ct
    );
    lightRequest.bri = getLightGradientColor(
      absTimeToSunset,
      lightSchedule.colors.sunset.bri
    );
  } else if (withinOneHourOfSunrise) {
    const absTimeToSunrise = Math.abs(timeToSunrise);
    lightRequest.ct = getLightGradientColor(
      absTimeToSunrise,
      lightSchedule.colors.sunset.ct
    );
    lightRequest.bri = getLightGradientColor(
      absTimeToSunrise,
      lightSchedule.colors.sunset.bri
    );
  } else if (withinOneHourOfBedTime) {
    const absTimeToBed = Math.abs(timeToBed);
    lightRequest.ct = getLightGradientColor(
      absTimeToBed,
      lightSchedule.colors.bedtime.ct
    );
    lightRequest.bri = getLightGradientColor(
      absTimeToBed,
      lightSchedule.colors.bedtime.bri
    );
  } else if (isDay) {
    lightRequest.ct = parseInt(lightSchedule.colors.day.ct);
    lightRequest.bri = parseInt(lightSchedule.colors.day.bri);
  } else if (isNight) {
    lightRequest.ct = parseInt(lightSchedule.colors.night.ct);
    lightRequest.bri = parseInt(lightSchedule.colors.night.bri);
  }
  console.log("lightRequest - ", lightRequest);
  for (let i = 0; i < lightGroups.length; i++) {
    changeLightingByGroup(lightRequest, lightGroups[i]);
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
