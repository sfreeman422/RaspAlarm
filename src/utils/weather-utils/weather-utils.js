import moment from "moment";
import weatherIcons from "./weatherIcons";
import * as config from "../../private/config";

/**
 * Generates the information necessary to display weather on the page.
 *
 * @export
 * @param {*} weatherArr - The result of a successful call to weather API.
 * @param {*} sunData - The result of a successful call to get sunrise and sunset data from weather API.
 * @returns An array including all weather related data the app s concerned with.
 */
export function generateWeatherState(weatherArr, sunData) {
  let weather = weatherArr;
  const sunrise = moment(sunData.sunrise, "hh:mma");
  const sunset = moment(sunData.sunset, "hh:mma");
  const firstWeatherHour = parseFloat(weather[0].FCTTIME.hour, 10);
  if (firstWeatherHour === parseFloat(moment().format("H"), 10)) {
    weather = weather.slice(1, 6);
  }

  const weatherState = [];
  for (let i = 0; i < 5; i += 1) {
    const currentHour = moment(weather[i].FCTTIME.civil, "hh:mma");
    const weatherIcon =
      currentHour.isBefore(sunrise) || currentHour.isAfter(sunset)
        ? weatherIcons[weather[i].icon].night
        : weatherIcons[weather[i].icon].day;
    console.debug("Returning weather icon ", weatherIcon);
    weatherState.push({
      condition: weather[i].condition,
      time: weather[i].FCTTIME.civil,
      temp: {
        english: {
          raw: parseFloat(weather[i].temp.english, 10),
          display: `${weather[i].temp.english}F`
        },
        metric: {
          raw: parseFloat(weather[i].temp.metric, 10),
          display: `${weather[i].temp.metric}C`
        }
      },
      icon: weatherIcon
    });
  }
  return weatherState;
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
