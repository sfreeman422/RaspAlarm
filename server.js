const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Alarm = require('./models/Alarms.js');
const methodOverride = require('method-override');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.RaspAlarmMongoDB);

const db = mongoose.connection;
db.on('open', () => {
  console.log('Connected to MongoDB on port 27017.');
});

db.on('error', (err) => {
  console.log(`An error has occurred: ${err}`);
});

app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static('./public'));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

app.get('/alarms', (req, res) => {
  Alarm.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      throw err;
    }
  });
});

// Adjusts brightness when running on a pi.
app.post('/brightness', (req, res) => {
  if (process.env.isRaspberryPi === 'true') {
    if (req.body.isNight === 'true') {
      exec(
        'echo 20 > /sys/class/backlight/rpi_backlight/brightness',
        (error) => {
          if (error) {
            res.json(`execError: ${error}`);
          } else {
            res.json('Successfully set brighness to night mode!');
          }
        },
      );
    } else if (req.body.isNight !== 'true') {
      exec(
        'echo 255 > /sys/class/backlight/rpi_backlight/brightness',
        (error) => {
          if (error) {
            res.json(`execError: ${error}`);
          } else {
            res.json('Successfully set brightness to day mode!');
          }
        },
      );
    }
  } else {
    res.json('RaspberryPi env variable not set. No changes made');
  }
});

// Route to set alarms.
app.post('/setAlarm', (req, res) => {
  const userTime = `${req.body.hour}:${req.body.minute}${req.body.ampm}`;
  let oneTimeUse = false;
  if (req.body.dayOfWeek.length === 0) {
    oneTimeUse = true;
  }
  const newAlarm = new Alarm({
    time: userTime,
    dayOfWeek: req.body.dayOfWeek,
    oneTimeUse,
  });

  newAlarm.save((err, completed) => {
    if (err) res.status(500).send('Error occurred during setting of alarm.');
    console.log(`Alarm saved as : ${completed}`);
    res.status(200).json('Alarm successfully saved.');
  });
});

// Route to delete alarms
app.delete('/deleteAlarm', (req, res) => {
  console.log(req.body);
  Alarm.find({ _id: req.body.id }).remove(() => {
    console.log('Successfully removed.');
    res.status(200).json('Successfully removed.');
  });
});

// Listen to the port.
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
