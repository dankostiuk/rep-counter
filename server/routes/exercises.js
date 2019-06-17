var express = require("express");
var mongoose = require("mongoose");
var moment = require("moment");
var router = express.Router();
var { ensureAuthenticated } = require("../config/auth");
var Exercise = require("../models/exercise.js");
var Workout = require("../models/workout.js");

/* PUT update current exercise. */
router.put("/", ensureAuthenticated, async function(req, res, next) {
  // prepare incoming exercise for saving
  const exercise = {
    name: req.body.name,
    reps: req.body.reps,
    weights: req.body.weights,
    notes: req.body.notes,
    isKg: req.body.isKg
  };

  // find a single workout of specified type for current user created within 24 hours
  const workout = await Workout.findOne({
    type: req.query.type,
    date: {
      $gte: moment()
        .utc()
        .subtract(24, "hours")
        .format("YYYY-MM-DDThh:mm"),
      $lte: moment()
        .utc()
        .format("YYYY-MM-DDThh:mm")
    },
    user_id: mongoose.Types.ObjectId(req.session.passport.user)
  });

  let workoutId = "";
  if (workout === null) {
    // create new workout for current date and get its id
    await Workout.create(
      {
        _id: mongoose.Types.ObjectId(),
        type: req.query.type,
        date: moment()
          .utc()
          .format("YYYY-MM-DDThh:mm"),
        user_id: mongoose.Types.ObjectId(req.session.passport.user)
      },
      async function(err, createdWorkout) {
        if (err) {
          console.log(err);
        }
        console.log("workoutId " + workoutId);
        // create new entry (or update existing) for exercise+workout_id combo
        // ensure that mongodb exercises collection has unique index (name + workout_id) to avoid duplicates
        await Exercise.findOneAndUpdate(
          {
            name: exercise.name,
            workout_id: mongoose.Types.ObjectId(createdWorkout._id)
          },
          exercise,
          { upsert: true, new: true },
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    );
  } else {
    console.log("workoutId " + workoutId);
    // create new entry (or update existing) for exercise+workout_id combo
    // ensure that mongodb exercises collection has unique index (name + workout_id) to avoid duplicates
    await Exercise.findOneAndUpdate(
      {
        name: exercise.name,
        workout_id: mongoose.Types.ObjectId(workout.id)
      },
      exercise,
      { upsert: true, new: true },
      function(err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  res.send(req.body);
});

module.exports = router;
