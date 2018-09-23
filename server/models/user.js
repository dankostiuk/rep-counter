// The User model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var md5 = require('md5');
var validator = require('validator');
var passportLocalMongoose = require('passport-local-mongoose');
var mongodbErrorHandler = require('mongoose-mongodb-errors');

var userSchema = new Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email address'],
      required: 'Please supply an email address'
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
