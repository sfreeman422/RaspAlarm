import fetch from "isomorphic-fetch";
import moment from "moment";
import * as config from "../private/config";

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
