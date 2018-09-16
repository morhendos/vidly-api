const mongoose = require('mongoose');
const Joi = require('joi');

// Create a genre model based on schema
const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));


function validateGenre(course) {
  const schema = {
    name: Joi.string().min(5).required()
  }

  return Joi.validate(course, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;