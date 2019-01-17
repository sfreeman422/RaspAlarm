/**
 * Determines which day of the week should be shown
 * and whether or not a spaceer should exist.
 *
 * @param {*} days - an array of days, for use with alarms.
 * @returns
 */
export function displayLetterForDayOfWeek(days) {
  const dayOfWeek = {
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "Th",
    Friday: "F",
    Saturday: "Sat",
    Sunday: "Sun"
  };
  let responseString = "";
  for (let i = 0; i < days.length; i += 1) {
    responseString +=
      i < days.length - 1 ? `${dayOfWeek[days[i]]} | ` : dayOfWeek[days[i]];
  }
  return responseString;
}
