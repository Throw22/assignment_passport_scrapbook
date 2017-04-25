const express = require("express");
const router = express.Router();
//Mongoose
const mongoose = require("mongoose");
const User = require("../models/user");

//Facebook Strategy
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  FACEBOOK_APP_ID_LOCAL,
  FACEBOOK_APP_SECRET_LOCAL
} = require("../tokens");
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || FACEBOOK_APP_ID_LOCAL;
console.log(FACEBOOK_APP_ID);
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ||
  FACEBOOK_APP_SECRET_LOCAL;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID || "hi",
      clientSecret: FACEBOOK_APP_SECRET || "no",
      callbackURL: "http://localhost:4000/auth/facebook/callback",
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
        User.findOne({facebookId}, function(err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }
          console.log("H", user);
          if (!user) {
            user = new User({facebookId, username: profile.displayName});
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
  )
);
//Routes
router.get("/", (req, res) => {
  if (req.user) {
    res.render("home");
  } else {
    res.render("login");
  }
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

module.exports = router;
