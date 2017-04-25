const express = require('express');
const router = express.Router();
//Mongoose
const mongoose = require('mongoose');
const User = require('../models/user');

//Facebook Strategy
const facebook = require('../strategies/facebook');

const passport = require('passport');

//Login path
//Log in with one of the five
//Either log them and create the user if they haven't logged in with that account before
//Or log them in with the already created user

//Connect paths
//If logged in with facebook, be able to connect the other 4

//if login through facebook, then use
passport.use(facebook.fbStrat);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Routes
router.get('/', (req, res) => {
  if (req.user) {
    res.render('home');
  } else {
    res.render('login');
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/privacy', function(req, res) {
  res.render('privacy');
});

router.get('/terms', function(req, res) {
  res.render('terms');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

module.exports = router;
