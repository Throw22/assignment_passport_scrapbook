const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  FACEBOOK_APP_ID_LOCAL,
  FACEBOOK_APP_SECRET_LOCAL
} = require("../tokens");

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || FACEBOOK_APP_ID_LOCAL;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ||
  FACEBOOK_APP_SECRET_LOCAL;

var fbStrat = new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID || "hi",
    clientSecret: FACEBOOK_APP_SECRET || "no",
    callbackURL: "http://localhost:4000/auth/facebook/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const facebookId = profile.id;
    const displayName = profile.displayName;
    console.log("req.user in fbstat", req.user);
    if (req.user) {
      req.user.facebookId = facebookId;
      req.user.save((err, user) => {
        console.log("saved user", user);
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    } else {
      User.findOne({facebookId}, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          user = new User({facebookId, displayName: profile.displayName});
          console.log("after new user save", user);
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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = {fbStrat};
