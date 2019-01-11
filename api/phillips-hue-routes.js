const Router = require("express").Router;
const LightSchedule = require("../models/LightSchedule");

const router = Router();

/**
 * Used to create an array of promises used by Promise.all to allow for bulk updates to schedules.
 *
 * @param {*} schedule
 * @returns Promise
 */
function updateSchedule(schedule) {
  return new Promise((resolve, reject) => {
    LightSchedule.findOne({ dayOfWeek: schedule.dayOfWeek }, (err, doc) => {
      const docExists = !!doc;
      if (err) {
        reject(err);
      } else if (!docExists) {
        schedule.save(err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        doc.off = schedule.off;
        doc.bedtime = schedule.bedtime;
        doc.colors = schedule.colors;
        doc.save();
        resolve();
      }
    });
  });
}

// Retrieves all light schedules.
router.get("/lights", (_req, res) => {
  LightSchedule.find({}, (err, docs) => {
    if (err) {
      res.json(err);
    } else {
      res.json(docs);
    }
  });
});

/**
 * This route is used to both add a new light schedule if one does not exist
 * and also overwrite existing light schedules.
 * This use case works because we are intending to only have our users use one DB for all of their
 * alarms, lights etc. This db generally will live on the device and only be access by one user.
 */
router.post("/lights", async (req, res) => {
  const updateArray = [];
  for (let i = 0; i < req.body.length; i++) {
    const newSchedule = new LightSchedule({
      dayOfWeek: req.body[i].dayOfWeek,
      off: req.body[i].off,
      bedtime: req.body[i].bedtime,
      colors: req.body[i].colors
    });
    updateArray.push(updateSchedule(newSchedule));
  }
  await Promise.all(updateArray)
    .then(() => res.status(200).json(`Successfully updated schedule.`))
    .catch(e => res.status(500).json(e));
});

router.delete("/lights", (req, res) => {
  console.log(req);
  LightSchedule.remove({}, (err, docs) => {
    console.log(err);
    console.log(docs);
  });
  res.send(200);
});

module.exports = router;
