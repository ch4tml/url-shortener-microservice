// load the things we need
var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
    original_url    : String,
    short_url       : String,
    stringGenerated : String,
    created_at      : Date
});

// on every save, add the date
urlSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('URL', urlSchema);