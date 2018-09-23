const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    }
  })
);

function validateRental(rental) {
  const schema = {
    movieId: Joi.string().required(),
    customerId: Joi.string().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
