const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const passportMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  facebookId: { type: String, require: true, unique: true },
  fbAccessToken: { type: String }
});

UserSchema.plugin(passportMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;
