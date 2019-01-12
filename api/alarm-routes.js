const Router = require("express").Router;
const Alarm = require("../models/Alarms.js");

const router = Router();

// Retrieves all alarms in the db.
router.get("/alarm", (_req, res) => {
  Alarm.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.json(err);
    }
  });
});

// Sets an alarm
router.post("/alarm", (req, res) => {
  const userTime = `${req.body.hour}:${req.body.minute}${req.body.ampm}`;
  let oneTimeUse = false;
  if (!req.body.dayOfWeek || req.body.dayOfWeek.length === 0) {
    oneTimeUse = true;
  }
  const newAlarm = new Alarm({
    time: userTime,
    dayOfWeek: req.body.dayOfWeek,
    oneTimeUse
  });

  newAlarm.save(err => {
    if (err)
      res.status(500).send(`Error occurred during setting of alarm. \n ${err}`);
    res.status(200).json("Alarm successfully saved.");
  });
});

// Deletes the specified alarm.
router.delete("/alarm", (req, res) => {
  Alarm.find({ _id: req.body.id }).remove(() => {
    res.status(200).json("Successfully removed.");
  });
});

module.exports = router;
