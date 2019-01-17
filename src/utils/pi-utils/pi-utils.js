import fetch from "isomorphic-fetch";

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
