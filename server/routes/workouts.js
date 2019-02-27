var express = require('express');
var moment = require('moment');
var router = express.Router();
var { ensureAuthenticated } = require('../config/auth');
var Workout = require('../models/workout.js');

/* GET past workouts listing. */
router.get('/', ensureAuthenticated, async function(req, res, next) {
  const matchObj = {
    type : req.query.type
  }
  if (req.query.date) {
    matchObj.date = new Date(req.query.date + ' 0:0');
  }

  console.log('matchObj: ' + JSON.stringify(matchObj));

  // get past workouts for workout type, sorted by date
  const workouts = await Workout.aggregate([
      {
        $lookup:
          {
            from: "exercises",
            localField: "_id",
            foreignField: "workout_id",
            as: "workout_exercises"
          }
     },
     {
       $match : matchObj
     },
     {
       $sort: {'date': -1}
     }
  ]);

  if (workouts !== undefined && workouts.length !== 0) {
    // send back the latest workout that isn't today
    let i = 0;
    if (!moment(workouts[i].date).isBefore(moment().startOf('day'))) {
      i++;
    }
    res.send(workouts[i]);
  } else {
    // send back empty list if no previous workouts
    res.send([]);
  }
});

/* GET past date list of workout type. */
router.get('/dates', ensureAuthenticated, async function(req, res, next) {
  const workouts = await Workout.find({"type" : req.query.type}).sort({'date': -1});

  let dates = [];
  if (workouts !== undefined && workouts.length !== 0) {
    workouts.forEach(workout => {
      if (moment(workout.date).isBefore(moment().startOf('day'))) {
          dates.push((workout.date.toISOString().split("T")[0]))
      }
    });
  }
  res.send(dates);
});

module.exports = router;
