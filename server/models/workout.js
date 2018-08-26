// The Workout model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var workoutSchema = new Schema({
    _id:  String,
    name: String,
    weight: String,
    reps: String
});

module.exports = mongoose.model('Workout', workoutSchema);
