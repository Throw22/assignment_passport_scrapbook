const app = require("express")();

const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");

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

app.set("view engine", "hbs");

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(4000);
