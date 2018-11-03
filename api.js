const winston = require("winston");
const express = require("express");
const app = express();
const dbName = "vidly";

// Start up
require("./startup/logging")(dbName);
require("./startup/db")(dbName);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();

const PORT = process.env.port || 3003;
console.log(PORT);

app.listen(PORT, () =>
  winston.info(`vidly api server listening on port ${PORT}`)
);
