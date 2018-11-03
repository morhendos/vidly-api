const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function(dbName) {
  // Setup winston transports (console, file, db):
  // Logging errors to console
  winston.add(
    winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  // Logging errors to file
  winston.add(winston.transports.File, { filename: "logfile.txt" });
  // Logging errors to db
  winston.add(winston.transports.MongoDB, {
    db: `mongodb://localhost/${dbName}`,
    level: "info"
  });

  // Caught exceptions outside of express
  process.on("uncaughtException", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // Caught exceptions outside of express
  process.on("unhandledRejection", ex => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
