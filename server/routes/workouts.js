var express = require("express");
var moment = require("moment");
var mongoose = require("mongoose");
var router = express.Router();
var { ensureAuthenticated } = require("../config/auth");
var Workout = require("../models/workout.js");
var Exercise = require("../models/exercise.js");

/* GET past workouts listing. */

router.get("/", ensureAuthenticated, async function(req, res, next) {
  const matchObj = {
    type: req.query.type,
    user_id: mongoose.Types.ObjectId(req.session.passport.user)
  };
  console.log("params: " + JSON.stringify(req.query));

  // get workouts within 24 hours of specified date
  if (req.query.date) {
    console.log("date: " + req.query.date);

    matchObj.date = {
      $gte: new Date(
        moment(req.query.date)
          .subtract(24, "hours")
          .format()
      ),
      $lte: new Date(
        moment(req.query.date)
          .add(1, "minutes")
          .format()
      )
    };

    console.log("matchObj: " + JSON.stringify(matchObj));
  }

  const workouts = await Workout.aggregate([
    {
      $lookup: {
        from: "exercises",
        localField: "_id",
        foreignField: "workout_id",
        as: "workout_exercises"
      }
    },
    {
      $match: matchObj
    },
    {
      $sort: { date: -1 }
    }
  ]);
  console.log("workouts: " + JSON.stringify(workouts));
  if (workouts !== undefined && workouts.length !== 0) {
    // send back the latest workout that isn't within 24 hours ago (this will be configurable later)
    for (let i = 0; i < workouts.length; i++) {
      let currentWorkoutDate = moment(workouts[i].date);
      if (!currentWorkoutDate.isBefore(moment().subtract(24, "hours"))) {
        console.log(
          "current workout date: " +
            currentWorkoutDate.format("YYYY-MM-DDTHH:mm")
        );
        console.log(
          "24 hours ago: " +
            moment()
              .subtract(24, "hours")
              .format("YYYY-MM-DDTHH:mm")
        );
        continue;
      }

      // add ORM
      let exercises = workouts[i].workout_exercises;
      for (let j = 0; j < exercises.length; j++) {
        let totalWeights = exercises[j].weights
          .split("-")
          .reduce((a, b) => parseInt(a) + parseInt(b));
        let totalReps = exercises[j].reps
          .split("-")
          .reduce((a, b) => parseInt(a) + parseInt(b));
        let sets = exercises[j].reps.split("-").length;
        let vScore = (totalReps * totalWeights) / sets;
        workouts[i].workout_exercises[j].v_score = vScore;
      }

      console.log("latest workout: " + JSON.stringify(workouts[i]));

      res.json(workouts[i]);
      break;
    }
  } else {
    // send back empty list if no previous workouts
    res.send({
      workout_exercises: []
    });
  }
});

/* GET past date list of workout type. */
router.get("/dates", ensureAuthenticated, async function(req, res, next) {
  const workouts = await Workout.find({
    type: req.query.type,
    user_id: mongoose.Types.ObjectId(req.session.passport.user)
  }).sort({ date: -1 });

  let dates = [];
  if (workouts !== undefined && workouts.length !== 0) {
    workouts.forEach(workout => {
      // get list of dates older than 24 hours (this can be configured later)
      let workoutDate = moment(workout.date);
      console.log("workoutDate: " + workoutDate.format("YYYY-MM-DDTHH:mm"));
      if (workoutDate.isBefore(moment().subtract(24, "hours"))) {
        dates.push(workoutDate.format("YYYY-MM-DDTHH:mm"));
      }
    });
  }
  console.log("dates: " + JSON.stringify(dates));
  res.send(dates);
});

/* GET distinct workout types for user */
router.get("/type", ensureAuthenticated, async function(req, res, next) {
  const workouts = await Workout.find({
    user_id: mongoose.Types.ObjectId(req.session.passport.user)
  }).distinct("type");

  let types = [];
  if (workouts !== undefined && workouts.length !== 0) {
    workouts.forEach(workout => {
      types.push(workout.charAt(0).toUpperCase() + workout.slice(1));
    });
  }
  console.log("distinct types: " + JSON.stringify(types));
  res.send(types);
});

/* DELETE all workouts of specified type for the current user */

router.delete("/type/:type", ensureAuthenticated, async function(
  req,
  res,
  next
) {
  console.log(
    "user " +
      req.session.passport.user +
      " deleting all workouts and exercises for type: " +
      req.params.type
  );

  //TODO: this is used once before too, maybe isolate it in its own method?
  const workouts = await Workout.aggregate([
    {
      $lookup: {
        from: "exercises",
        localField: "_id",
        foreignField: "workout_id",
        as: "workout_exercises"
      }
    },
    {
      $match: {
        type: req.params.type,
        user_id: mongoose.Types.ObjectId(req.session.passport.user)
      }
    },
    {
      $sort: { date: -1 }
    }
  ]);

  //TODO: maybe have a single delete rather than looping through everything?
  workouts.forEach(async workout => {
    workout.workout_exercises.forEach(async exercise => {
      console.log("deleting exercise.. " + exercise._id);
      await Exercise.deleteOne({ _id: exercise._id });
    });

    console.log("deleting workout.. " + workout._id);
    await Workout.deleteOne({ _id: workout._id });
  });
  res.send(workouts);
});

module.exports = router;
