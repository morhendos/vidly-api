const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');


router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) res.status(404).send('The customer with given ID could not be found');
    res.send(customer);
  }
  catch (err) {
    res.status(400).send(err.message);
  }

});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  },
    { new: true }
  );
  if (!customer) return res.status(404).send('The customer with given ID could not be find');

  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  try {
    customer = await customer.save();
    res.send(customer);
  }
  catch (err) {
    res.status(400).send('Error while posting: ', err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id });
    if (!customer) {
      res.send('Customer of given id could not be found');
      return;
    }
    res.send(customer);
  }
  catch (err) {
    res.send(err.message);
  }

});



module.exports = router;