const validator = require('../middlewares/validator')
const {User, validate} = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.find()
  res.send(user);
})

router.post('/', validator(validate), async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if (user) res.status(400).send('User already registered');

  user = new User(_.pick(req.body, ['username', 'email', 'password']));

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  user.userStats = user.generateUserStats();
  const token = user.generateAuthToken();

  await user.save();
  
  res.header('auth-token', token).send(_.pick(user, ['_id', 'username', 'email']))
  // res.send(user);
})

module.exports = router;