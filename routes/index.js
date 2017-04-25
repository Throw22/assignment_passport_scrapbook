const express = require("express");
const router = express.Router();
//Mongoose
const mongoose = require("mongoose");
const User = require("../models/user");

//FB Graph Api
var {FB, FacebookApiException} = require("fb");

router.get("/", (req, res) => {
  // console.log("req.user in get router", req.user);
  if (req.user) {
    res.render("home");
  } else {
    res.render("login");
  }
});
//Facebook Strategy
const facebook = require("../strategies/facebook");
const passport = require("passport");
passport.use(facebook.fbStrat);

//Home

//Login
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/privacy", function(req, res) {
  res.render("privacy");
});

router.get("/terms", function(req, res) {
  res.render("terms");
});

//Facebook
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);
////
module.exports = router;

//Login path
//Log in with one of the five
//Either log them and create the user if they haven't logged in with that account before
//Or log them in with the already created user

//Connect paths
//If logged in with facebook, be able to connect the other 4

//if login through facebook, then use
