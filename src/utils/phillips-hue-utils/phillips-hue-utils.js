import fetch from "isomorphic-fetch";
import moment from "moment";
import * as config from "../../private/config";

/**
 * Generates an array of the numeric id's of each group from Phillip's Hue Bridge.
 * Note: We have to parseInt here because the Bridge API returns stringified values.
 * @param {*} lightData - An object containing light groups.
 * @returns
 */
export function generateGroupArray(lightData) {
  const groups = [];
  Object.keys(lightData).forEach(key => {
    groups.push({
      groupId: parseInt(key),
      groupName: lightData[key].name,
      currentCt: lightData[key].action.ct,
      currentBri: lightData[key].action.bri
    });
  });
  return groups;
}

/**
 * Determines what percentage of our target brightness/ct we should show.
 *
 * @param {*} time - Time to either bedTime, sunrise, or sunset.
 * @param {*} visual - The ct or brightness number that we are concerned with.
 * @returns The integer value of the visual * the percentage of the hour we are close to.
 */
export function getLightGradient(time, target, current) {
  if (time <= 0) {
    return Math.floor(target);
  } else {
    const diff = (current - target) * (1 - time / 60);
    return Math.floor(current - diff);
  }
}

/**
 * Gets the current light data, generates groupings,
 * retrieves light schedule from db,
 * and iterates through to generate and execute light changes.
 *
 * @export
 * @param {*} day
 * @param {*} sunData
 */
export async function changeLightingForGroups(day, sunData) {
  const lightData = await getLightData();
  const lightGroups = generateGroupArray(lightData.groups);
  const lightSchedule = await fetch(`/lights/${day}`)
    .then(res => res.json())
    .catch(e => console.error(e));
  for (let i = 0; i < lightGroups.length; i++) {
    generateLightRequest(sunData, lightGroups[i], lightSchedule);
  }
}

/**
 * Generates a request for our Phillips Hue Bridge based on
 * the lightGroup, lightSchedule and sunrise and sunset.
 *
 * @export
 * @param {*} sunData - Sunrise and sunset data as moment objects.
 * @param {*} lightGroup - The lightGroup that we are concerned with.
 * Should be an object including groupId, currentBri and currentCt.
 * @param {*} lightSchedule - Object containing brightness,
 * ct, and on/off schedule.
 */
export async function generateLightRequest(sunData, lightGroup, lightSchedule) {
  const { sunrise, sunset } = sunData;
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
    on: shouldBeOn(lightSchedule.off, lightGroup.groupId)
  };

  // This is so gnar fix this wtf.
  if (withinOneHourOfSunset) {
    const absTimeToSunset = Math.abs(timeToSunset);
    lightRequest.ct = getLightGradient(
      absTimeToSunset,
      lightSchedule.colors.sunset.ct
    );
    lightRequest.bri = getLightGradient(
      absTimeToSunset,
      lightSchedule.colors.sunset.bri
    );
  } else if (withinOneHourOfSunrise) {
    const absTimeToSunrise = Math.abs(timeToSunrise);
    lightRequest.ct = getLightGradient(
      absTimeToSunrise,
      lightSchedule.colors.sunset.ct
    );
    lightRequest.bri = getLightGradient(
      absTimeToSunrise,
      lightSchedule.colors.sunset.bri
    );
  } else if (withinOneHourOfBedTime) {
    const absTimeToBed = Math.abs(timeToBed);
    lightRequest.ct = getLightGradient(
      absTimeToBed,
      lightSchedule.colors.bedtime.ct
    );
    lightRequest.bri = getLightGradient(
      absTimeToBed,
      lightSchedule.colors.bedtime.bri
    );
  } else if (isDay) {
    lightRequest.ct = parseInt(lightSchedule.colors.day.ct);
    lightRequest.bri = parseInt(lightSchedule.colors.day.bri);
  } else if (isNight) {
    lightRequest.ct = parseInt(
      time.isAfter(bedTime)
        ? lightSchedule.colors.bedtime.ct
        : lightSchedule.colors.night.ct
    );
    lightRequest.bri = parseInt(
      time.isAfter(bedTime)
        ? lightSchedule.colors.bedtime.bri
        : lightSchedule.colors.night.bri
    );
  }
  changeLightingByGroup(lightRequest, lightGroup.groupId);
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
 * @param {*} group - The groupId that we are concerned with.
 * @returns boolean - telling us whether or not specific groups should be on or off.
 */
export function shouldBeOn(scheduleArray, group) {
  const time = moment();
  const formattedTime = moment(time, "hh:mm:a");
  let returnVal = true;
  for (let i = 0; i < scheduleArray.length; i += 1) {
    const start = moment(scheduleArray[i].start, "hh:mm:a");
    const end = moment(scheduleArray[i].end, "hh:mm:a");
    if (
      formattedTime.isBetween(start, end) &&
      scheduleArray[i].groups.includes(group)
    ) {
      returnVal = false;
    }
  }
  return returnVal;
}
