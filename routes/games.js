const auth = require('../middlewares/auth')
const { User } = require('../models/user')
const express = require('express');
const router = express.Router();

router.get('/signin', async (req, res) => {
  res.render('signin');
})

router.get('/signup', async (req, res) => {
  res.render('signup');
})

router.get('/index', auth, async (req, res) => {
  const user = await User.findById(req.body._id).select('username friendList userStats.exp userStats.trophy')
  res.render('index', ({user: user}));
})

module.exports = router;
