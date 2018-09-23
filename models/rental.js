const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 150
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 9,
          maxlength: 15
        }
      }),
      required: true
    },

    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 255
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      }),
      required: true
    },
    dataOut: {
      type: Date,
      required: true,
      default: Date.now
    },
    dataReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
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
