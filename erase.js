const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.connect("mongodb://localhost/passport-demo");

User.remove({}, function(err) {
  console.log("collection removed");
});
