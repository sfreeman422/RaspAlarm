const mongoose = require("mongoose");

const colorObject = {
  bri: String,
  ct: String
};

const colorSchema = mongoose.Schema({
  day: colorObject,
  night: colorObject,
  bedtime: colorObject
});

module.exports = colorSchema;
