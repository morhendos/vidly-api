const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const dbName = "vidly";

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

const PORT = process.env.port || 3003;
console.log(PORT);

app.listen(PORT, () =>
  console.log(`vidly api server listening on port ${PORT}`)
);
