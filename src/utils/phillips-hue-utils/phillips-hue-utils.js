import fetch from "isomorphic-fetch";
import moment from "moment";
import * as config from "../private/config";

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

/**
 * Generates a request for our Phillips Hue Bridge based on
 * the current day, sunrise and sunset.
 *
 * @export
 * @param {*} sunData - Sunrise and sunset data as moment objects.
 * @param {*} day - The current day of the week.
 */
export async function getLightRequest(sunData, day) {
  const { sunrise, sunset } = sunData;
  const lightData = await getLightData();
  const lightGroups = generateGroupValues(lightData.groups);
  const lightSchedule = await fetch(`/lights/${day}`).catch(e =>
    console.error(e)
  );
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

/**
 * Called by getLightRequest, this function adjusts the groups lighting color/on status accordingly.
 *
 * @export
 * @param {*} lightConfig
 * @param {*} group
 */
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

/**
 * Searches a given array to determine whether the current time
 * is between the start and end of the Off Schedule.
 * Off schedules are used to tell our Phillips Hue Bridge
 * when to turn specific groups on or off.
 *
 * @export
 * @param {*} scheduleArray - An Off Schedule that contains start and end times.
 * @param {*} groups - The groups that we are concerned with adjusting.
 * @returns boolean - telling us whether or not specific groups should be on or off.
 */
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
