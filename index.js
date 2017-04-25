const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");

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

const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.connect("mongodb://localhost/passport-demo");

// Local Strategy Set Up

// const LocalStrategy = require("passport-local").Strategy;
//
// passport.use(
//   new LocalStrategy(function(username, password, done) {
//     User.findOne({username}, function(err, user) {
//       console.log(user);
//       if (err) return done(err);
//       if (!user || !user.validPassword(password))
//         return done(null, false, {message: "Invalid username/password"});
//       return done(null, user);
//     });
//   })
// );
//
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// facebook
// const FacebookStrategy = require("passport-facebook").Strategy;
// const {
//   FACEBOOK_APP_ID_LOCAL,
//   FACEBOOK_APP_SECRET_LOCAL
// } = require("./tokens");
// const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || FACEBOOK_APP_ID_LOCAL;
// console.log(FACEBOOK_APP_ID);
// const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET ||
//   FACEBOOK_APP_SECRET_LOCAL;
//
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID || "hi",
//       clientSecret: FACEBOOK_APP_SECRET || "no",
//       callbackURL: "http://localhost:4000/auth/facebook/callback",
//       passReqToCallback: true
//     },
//     function(req, accessToken, refreshToken, profile, done) {
//       const facebookId = profile.id;
//       if (req.user) {
//         req.user.facebookId = facebookId;
//         req.user.save((err, user) => {
//           if (err) {
//             done(err);
//           } else {
//             done(null, user);
//           }
//         });
//       } else {
//         User.findOne({facebookId}, function(err, user) {
//           if (err) {
//             console.log(err);
//             return done(err);
//           }
//           console.log("H", user);
//           if (!user) {
//             user = new User({facebookId, username: profile.displayName});
//             console.log(user);
//             user.save((err, user) => {
//               if (err) {
//                 console.log(err);
//               }
//               done(null, user);
//             });
//           } else {
//             done(null, user);
//           }
//         });
//       }
//     }
//   )
// );
//
// app.get("/auth/facebook", passport.authenticate("facebook"));
//
// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login"
//   })
// );

app.set("view engine", "hbs");

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(4000);
