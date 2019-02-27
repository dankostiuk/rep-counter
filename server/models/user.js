// The User model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var validator = require('validator');
var mongodbErrorHandler = require('mongoose-mongodb-errors');

var userSchema = new Schema({
    _id: {
      type: Schema.ObjectId,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email address'],
      required: 'Please supply an email address'
    },
    password: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
