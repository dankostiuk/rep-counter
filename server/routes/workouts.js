var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET past workouts listing. */
router.get('/', function(req, res, next) {
  console.log('Getting past workouts');

  //TODO: mongoose to query for workout
  res.json([{
  	id: 1,
  	name: "push"
  }, {
  	id: 2,
  	name: "pull"
  }]);
});

module.exports = router;
