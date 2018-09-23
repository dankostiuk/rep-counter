var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {

    try {
      req.session.save();
    } catch(error) {
      console.log(error);
      res.status(500).send({ error : error.message });
    }

    res.status(200).send('OK');
});

router.post('/register', async function(req, res, next) {
  console.log('user trying to register');
  const user = new User({
    email: req.body.email
  });

  try {
    await User.register(user, req.body.password);
    await passport.authenticate('local');
    res.redirect('/');
  } catch(error) {
    console.log(error);
  }
});

module.exports = router;
