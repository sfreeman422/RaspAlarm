const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const brightnessRoutes = require("./api/brightness-route");
const lightRoutes = require("./api/phillips-hue-routes");
const alarmRoutes = require("./api/alarm-routes");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.RaspAlarmMongoDB);

const db = mongoose.connection;
db.on("open", () => {
  console.log("Connected to MongoDB on port 27017.");
});

db.on("error", err => {
  console.log(`Error on DB:\n${err}`);
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(brightnessRoutes);
app.use(lightRoutes);
app.use(alarmRoutes);

app.get("/", (_req, res) => {
  res.sendFile("./public/index.html");
});

// Listen to the port.
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
