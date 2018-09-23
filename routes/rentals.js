const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const rentals = await Rental.find()
    .populate("movieId", "title -_id")
    .populate("customerId", "name -_id");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie id");

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("invalid customer id");

    let rental = new Rental({
      movieId: movie._id,
      customerId: customer._id
    });

    try {
      rental = await rental.save();
      res.send(rental);
    } catch (err) {
      res.status(400).send(`${err.name}: ${err.message}`);
    }
  } catch (err) {
    res.status(400).send(`${err.name}: ${err.message}`);
  }
});

router.delete("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("invalid movie id");

    const customer = await Customer.findById(req.body.customerId);
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
