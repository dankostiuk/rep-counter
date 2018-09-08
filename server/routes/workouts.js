var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var router = express.Router();
var Workout = require('../models/workout.js');

/* GET past workouts listing. */
router.get('/', async function(req, res, next) {
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
       $match : { type : req.query.type }
     },
     {
       $sort: {'date': -1}
     }
  ]);

  // send back the latest workout that isn't today
  let i = 0;
  if (!moment(workouts[i].date).isBefore(moment().startOf('day'))) {
    i++;
  }
  res.send(workouts[i]);
});

module.exports = router;
