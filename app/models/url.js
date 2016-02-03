// load the things we need
var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({

    local               : {
        original_url    : String,
        short_url       : String,
        redirect        : String
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', urlSchema);