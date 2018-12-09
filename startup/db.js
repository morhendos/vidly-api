const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
module.exports = function() {
  const db = config.get("db");

  // Connect to db
  mongoose
    .connect(
      db,
      { useNewUrlParser: true }
    )
    .then(() => winston.info(`Connected to ${db}`));
};
