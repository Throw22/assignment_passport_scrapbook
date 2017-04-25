const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");
const {
  FACEBOOK_APP_ID_LOCAL,
  FACEBOOK_APP_SECRET_LOCAL
} = require("./tokens");

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || FACEBOOK_APP_ID_LOCAL;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ||
  FACEBOOK_APP_SECRET_LOCAL;

var FB = require("fb");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// User and Mongoose code

const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-demo");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// facebook
const FacebookStrategy = require("passport-facebook").Strategy;

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
      //This is only for once we implement another login strategy
      if (req.user) {
        //attach whatever other login info to req.user (because user already exists)
        req.user.facebookId = facebookId;
        req.user.save((err, user) => {
          if (err) {
            done(err);
          } else {
            done(null, user); //user gets serialized
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
            user = new User({
              facebookId,
              displayName: profile.displayName,
              fbAccessToken: accessToken
            });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              done(null, user); //user gets serialized
            });
          } else {
            done(null, user); //user gets serialized
          }
        });
      }
    }
  )
);

//Sends user to facebook to approve
app.get("/auth/facebook", passport.authenticate("facebook"));

//Facebook sends user back with successful signin or failed signin
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  let fbResponse;
  if (req.user) {
    FB.api(
      "/me",
      "get",
      {
        fields: "name,link,picture,gender,birthday",
        access_token: req.user.fbAccessToken
      },
      function(response) {
        if (response && !response.error) {
          console.log(response);
          fbResponse = response;
          res.render("home", {user: req.user, fbResponse});
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(4000);
