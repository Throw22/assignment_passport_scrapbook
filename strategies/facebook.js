const mongoose = require('mongoose');
const User = require('../models/user');

const FacebookStrategy = require('passport-facebook').Strategy;
const {
  FACEBOOK_APP_ID_LOCAL,
  FACEBOOK_APP_SECRET_LOCAL
} = require('../tokens');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || FACEBOOK_APP_ID_LOCAL;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ||
  FACEBOOK_APP_SECRET_LOCAL;

var fbStrat = new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID || 'hi',
    clientSecret: FACEBOOK_APP_SECRET || 'no',
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const facebookId = profile.id;
    if (req.user) {
      req.user.facebookId = facebookId;
      req.user.save((err, user) => {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    } else {
      User.findOne({ facebookId }, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        console.log('H', user);
        if (!user) {
          user = new User({ facebookId, username: profile.displayName });
          console.log(user);
          user.save((err, user) => {
            if (err) {
              console.log(err);
            }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  }
);

module.exports = { fbStrat };
