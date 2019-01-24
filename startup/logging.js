const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");
// const config = require("config");

module.exports = function() {
  // Setup winston transports (console, file, db):

  // Logging errors to file
  winston.add(winston.transports.File, { filename: "logfile.txt" });
  // Logging errors to db
  // winston.add(winston.transports.MongoDB, {
  //   db: config.get("db"),
  //   level: "info"
  // });

  // Caught exceptions outside of express
  process.on("uncaughtException", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // Caught rejection outside of express
  process.on("unhandledRejection", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
