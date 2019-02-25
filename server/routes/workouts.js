var express = require('express');
var moment = require('moment');
var router = express.Router();
var Workout = require('../models/workout.js');

/* GET past workout listing. */
router.get('/', async function(req, res, next) {

  let matchObj = {
    type : req.query.type
  }
  if (req.query.date !== undefined) {
    matchObj.date = new Date(req.query.date + ' 0:0');
  }

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
    res.send({});
  }
});

/* GET past date list of workout type. */
router.get('/dates', async function(req, res, next) {
  const workouts = await Workout.find({"type" : req.query.type}).sort({'date': -1});

  if (workouts !== undefined && workouts.length !== 0) {
    dates = [];
    workouts.forEach(workout => {
      if (moment(workout.date).isBefore(moment().startOf('day'))) {
          dates.push((workout.date.toISOString().split("T")[0]))
      }
    });
    res.send(dates);
  } else {
    res.send([]);
  }
});

module.exports = router;
