const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("invalid genre");
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });

    try {
      movie = await movie.save();
      res.send(movie);
    } catch (err) {
      res.status(400).send(err.message);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id });
    if (!movie) {
      res.send("Movie of given id could not be found");
      return;
    }
    res.send(movie);
  } catch (err) {
    res.send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("invalid genre");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );
    if (!movie)
      return res.status(404).send("Movie with given ID could not be find");

    res.send(movie);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
