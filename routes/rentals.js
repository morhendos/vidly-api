const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { User } = require("../models/customer");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await User.findById(req.body.customerId);
    if (!customer) return res.status(400).send("invalid customer id");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie id");
    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
    });

    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update(
          "movies",
          { _id: movie._id },
          {
            $inc: { numberInStock: -1 }
          }
        )
        .run();

      res.send(rental);
    } catch (ex) {
      // Internal server error
      res.status(500).send(`Something went wrong. ${ex.name}: ${ex.message}`);
    }
  } catch (err) {
    // Bad request
    res.status(400).send(`${err.name}: ${err.message}`);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const rental = await Rental.findOneAndDelete({ _id: req.params.id });
    if (!rental) {
      res.send("Rental of given id could not be found");
      return;
    }
    res.send(rental);
  } catch (err) {
    res.send(err.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie id");

    const customer = await User.findById(req.body.customerId);
    if (!customer) return res.status(400).send("invalid customer id");

    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        movieId: req.body.movieId,
        customerId: req.body.customerId
      },
      { new: true }
    );
    if (!rental)
      return res.status(404).send("Rental with given ID could not be found");

    res.send(rental);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
