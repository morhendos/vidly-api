const winston = require("winston");
const express = require("express");
const app = express();

// Start up
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();

const PORT = process.env.port || 3003;

const server = app.listen(PORT, () =>
  winston.info(`listening on port ${PORT}`)
);

module.exports = server;
