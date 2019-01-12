const Router = require("express").Router;
const { exec } = require("child_process");

const router = Router();

/**
 * This route is used to adjust brightness when running on a Raspberry Pi.
 * The default values for the brightness file location are hardcoded since this is intended for the pi.
 * ToDo: Allow a configurable brightness file location.
 */
router.post("/brightness", (req, res) => {
  if (process.env.isRaspberryPi === "true") {
    exec(
      `echo ${
        req.body.isNight ? 20 : 255
      } > /sys/class/backlight/rpi_backlight/brightness`,
      error => {
        if (error) {
          res.json(`execError: ${error}`);
        } else {
          res.json(
            `Successfully set brighness to ${
              req.body.isNight ? "night" : "day"
            } mode!`
          );
        }
      }
    );
  } else if (
    !process.env.isRaspberryPi ||
    process.env.isRaspberryPi === "false"
  ) {
    res.json("RaspberryPi env variable not set. No changes made");
  }
});

module.exports = router;
