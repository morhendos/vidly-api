const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

// router.get("/:id", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user)
//       res.status(404).send("The user with given ID could not be found");
//     res.send(user);
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  console.log(user);

  res.send(user);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
    { new: true }
  );
  if (!user)
    return res.status(404).send("The user with given ID could not be found");

  res.send(user);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  // Hash password
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  // Generate token
  const token = user.generateAuthToken();

  try {
    await user.save();
    res
      .header("x-auth-token", token)
      .send({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).send("Error while posting: ", err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      res.send("user of given id could not be found");
      return;
    }
    res.send(user);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
