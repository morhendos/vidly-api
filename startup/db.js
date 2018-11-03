const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function(dbName) {
  // Connect to db
  mongoose
    .connect(
      `mongodb://localhost/${dbName}`,
      { useNewUrlParser: true }
    )
    .then(() => winston.info(`Connected to database: ${dbName} `));
};
