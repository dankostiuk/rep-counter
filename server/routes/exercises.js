var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var router = express.Router();
var Exercise = require('../models/exercise.js');
var Workout = require('../models/workout.js');

/* POST update current exercise. */
router.post('/', async function(req, res, next) {

  console.log(JSON.stringify(req.body));

  const workout = await Workout.findOne({ type: req.query.type, date: moment().startOf('day') });

  let workoutId = '';
  if (workout == null) {
    // create new workout for date and get its id
    await Workout.create({ _id: mongoose.mongo.ObjectId(), type: req.query.type, date: moment().startOf('day') }, function (err, createdWorkout) {
      if (err) {
        console.log(err);
      }
      workoutId = createdWorkout.id;
    });
  } else {
    workoutId = workout.id;
  }

  // prepare incoming exercise for saving
  const exercise = {
    name: req.body.name,
    reps: req.body.reps,
    weights: req.body.weights,
    notes: req.body.notes
  }

  // create new entry (or update existing) for exercise+workout_id combo
  await Exercise.findOneAndUpdate(
    { name: exercise.name, workout_id: mongoose.Types.ObjectId(workoutId) },
    exercise,
    {upsert: true, new: true},
    function (err) {
    if (err) {
      console.log(err);
    }
  });

  //TODO: send success response
  res.send(req.body);
});

module.exports = router;
