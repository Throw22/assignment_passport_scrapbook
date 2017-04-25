const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passportMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  displayName: { type: String },
  facebookId: { type: String, unique: true },
  fbAccessToken: { type: String },
  twitterId: { type: String, unique: true }
});

UserSchema.plugin(passportMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;
