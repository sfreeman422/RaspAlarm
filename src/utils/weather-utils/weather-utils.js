import moment from "moment";
import weatherIcons from "./weatherIcons";

export const generateWeatherState = (weatherArr, sunData) => {
  let weather = weatherArr;
  const sunrise = moment(sunData.sunrise, "hh:mm:a");
  const sunset = moment(sunData.sunset, "hh:mm:a");
  const firstWeatherHour = parseFloat(weather[0].FCTTIME.hour, 10);
  if (firstWeatherHour === parseFloat(moment().format("H"), 10)) {
    weather = weather.slice(1, 6);
  }

  const weatherState = [];
  for (let i = 0; i < 5; i += 1) {
    const currentHour = moment(weather[i].FCTTIME.civil, "hh:mm:a");
    console.debug("currentHour: ", currentHour);
    console.debug("sunrise", sunrise);
    console.debug("sunset", sunset);
    console.debug("before sunrise: ", currentHour.isBefore(sunrise));
    console.debug("after sunrise: ", currentHour.isAfter(sunrise));
    console.debug("before sunset: ", currentHour.isBefore(sunset));
    console.debug("after sunset: ", currentHour.isAfter(sunset));
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
};
