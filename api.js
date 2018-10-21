require("express-async-errors");
const winston = require("winston");
const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const dbName = "vidly";
const app = express();
const config = require("config");
const error = require("./middleware/error");

winston.add(winston.transports.File, { filename: "logfile.txt" });

// Check if jwtPriavateKey is set, if not terminate a process
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

// Connect to db
mongoose
  .connect(
    `mongodb://localhost/${dbName}`,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Connected to ${dbName} database`))
  .catch(err => console.log("Error while connecting to DB:", err.message));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const PORT = process.env.port || 3003;
console.log(PORT);

app.listen(PORT, () =>
  console.log(`vidly api server listening on port ${PORT}`)
);
