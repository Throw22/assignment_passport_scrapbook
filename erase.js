const User = require('./models/User');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passport-demo');

User.remove({}, function(err) {
  console.log('collection removed');
});
