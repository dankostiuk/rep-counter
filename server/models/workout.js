// The Workout model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var workoutSchema = new Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    type: String,
    date: Date,
    user_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Workout', workoutSchema);
