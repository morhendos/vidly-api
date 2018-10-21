const Joi = require("joi");
const mongoose = require("mongoose");

// Create a customer model based on schema
const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 150
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 15
    }
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required(),
    phone: Joi.string()
      .min(9)
      .max(15)
      .required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
