var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Workout = require('../models/workout.js');

/* GET past workouts listing. */
router.get('/', async function(req, res, next) {
  const workouts = await Workout.find({ type: req.query.type });
  res.send(workouts);
});

module.exports = router;
