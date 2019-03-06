var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user.js');
var passport = require('passport');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login - checks if cookie has user id. */
router.get('/login', async function(req, res, next) {
  console.log('GET login called');
  if (req.session.passport) {
    console.log('Passport obj (from cookie): ' + JSON.stringify(req.session.passport));

    let success = null;
    await User.findOne({ _id: req.session.passport.user})
      .then(user => {
        if (user) {
          success = true;
        }
        console.log(user);
      })
      .catch(error => {
        console.log(error);
      })
    if (success) {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
});

/* POST login. */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })(req, res, next)
});


/* POST register. */
router.post('/register', async function(req, res, next) {
  console.log('user trying to register');

  const { email, password } = req.body;
  let errors = [];

  // check required fields
  if (!email || !password) {
    console.log('missing fields')
    errors.push({
      msg: 'Please fill in all fields'
    });
  }

  // check password length
  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    // TODO: handle this better, errors sent back should be visible to user
    res.status(400).send(errors);
  } else {
    User.findOne({ email: email})
      .then(user => {
        if (user) {
          errors.push({
            msg: 'Email is already registered'
          })
          res.status(409).send(errors);
        } else {
          let id = mongoose.Types.ObjectId();
          const newUser = new User({
            _id: id,
            email: email,
            password: password,
          });

          bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                throw err;
              }
              // set password to hashed
              newUser.password = hash;
              // save user
              newUser.save()
                .then(user => {
                  passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/',
                  })(req, res, next);
                })
                .catch(err => console.log(err))
            }))

        }
      });
  }
});

/* GET logout. */
router.get('/logout', (req, res) => {
  console.log('logging out...');
  req.logout();
  res.redirect('/');
});

module.exports = router;
