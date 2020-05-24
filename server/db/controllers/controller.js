// controller.js
// Import user model
User = require('../models/user');
const bcrypt = require('bcrypt');
// Handle index actions
exports.index = function(req, res) {
    User.get(function(err, users) {
        if (err) {
            res.json({
                status: 'error',
                message: err
            });
        }
        res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users
        });
    });
};
// Handle create user actions
exports.new = async function(req, res) {
    let check = await User.find({ email: req.body.email });
    if (check[0] != null) {
        return res.status(200).send('That user already exists!');
    } else {
        var user = new User({
            spotify_id: req.body.spotify_id,
            email: req.body.email,
            display_name: req.body.display_name,
            country: req.body.country
        });
        const salt = await bcrypt.genSalt(10);
        user.display_name = await bcrypt.hash(user.display_name, salt);
        // save the user and check for errors
        user.save(function(err) {
            // Check for validation error
            if (err) res.json(err);
            else
                res.json({
                    status: 'success',
                    message: 'New user created!',
                    data: user
                });
        });
    }
};
// Handle view user info
exports.view = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        res.json({
            status: 'success',
            message: 'User details loading..',
            data: user
        });
    });
};