// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'success',
        message: 'Welcome to Fireside Party'
    });
});
// Import user controller
var userController = require('./controllers/controller');

// User routes
router.route('/users').get(userController.index).post(userController.new);

// Export API routes
module.exports = router;