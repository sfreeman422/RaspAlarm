const Router = require("express").Router;
const { exec } = require("child_process");

const router = Router();

/**
 * This route is used to adjust brightness when running on a Raspberry Pi.
 * The default values for the brightness file location are hardcoded since this is intended for the pi.
 * ToDo: Allow a configurable brightness file location.
 * ToDo: Use boolean instead of string values.
 */
router.post("/brightness", (req, res) => {
  if (process.env.isRaspberryPi === "true") {
    exec(
      `echo ${
        req.body.isNight ? 20 : 255
      } > /sys/class/backlight/rpi_backlight/brightness`,
      error => {
        error
          ? res.json(`Error setting brightness: ${error}`)
          : res.json(
              `Successfully set brighness to ${
                req.body.isNight ? "night" : "day"
              } mode!`
            );
      }
    );
  } else {
    res.json("RaspberryPi env variable not set. No changes made");
  }
});

module.exports = router;
