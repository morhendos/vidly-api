const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      res.status(404).send("The genre with given ID could not be found");
    res.send(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("The genre with given ID could not be find");

  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let genre = new Genre({ name: req.body.name });

  try {
    await genre.save();
    res.send(genre);
  } catch (err) {
    res.status(400).send("Error while posting: ", err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findOneAndDelete({ _id: req.params.id });
    if (!genre) {
      res.send("Genre of given id could not be found");
      return;
    }
    res.send(genre);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
