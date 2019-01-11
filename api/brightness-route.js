const Router = require("express").Router;
const { exec } = require("child_process");

const router = Router();

// Adjusts brightness when running on a pi.
router.post("/brightness", (req, res) => {
  if (process.env.isRaspberryPi === "true") {
    if (req.body.isNight) {
      exec("echo 20 > /sys/class/backlight/rpi_backlight/brightness", error => {
        if (error) {
          res.json(`execError: ${error}`);
        } else {
          res.json("Successfully set brighness to night mode!");
        }
      });
    } else if (!req.body.isNight) {
      exec(
        "echo 255 > /sys/class/backlight/rpi_backlight/brightness",
        error => {
          if (error) {
            res.json(`execError: ${error}`);
          } else {
            res.json("Successfully set brightness to day mode!");
          }
        }
      );
    }
  } else if (
    !process.env.isRaspberryPi ||
    process.env.isRaspberryPi === "false"
  ) {
    res.json("RaspberryPi env variable not set. No changes made");
  }
});

module.exports = router;
