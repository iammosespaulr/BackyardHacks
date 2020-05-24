// user.js
var mongoose = require('mongoose');
// Setup schema
var userScheme = mongoose.Schema({
    spotify_id: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});
// Export User model
var User = (module.exports = mongoose.model('user', userScheme));
module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
};