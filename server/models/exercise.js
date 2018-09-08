// The Exercise model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    name: String,
    reps: String,
    weights: String,
    notes: String,
    workout_id: mongoose.Schema.Types.ObjectId

});

module.exports = mongoose.model('Exercise', exerciseSchema);
