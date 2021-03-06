// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialize the app
https = require('https');
var fs = require('fs');
let app = express();

// Import routes
let apiRoutes = require('./routes');
// Configure bodyparser to handle post requests
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/firesideParty', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

// Added check for DB connection

if (!db) console.log('Error connecting db');
else console.log('Db connected successfully');

// Setup server port
var port = process.env.PORT || 4000;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello! This is the MongoDB server for Fireside Party'));

// Use Api routes in the App
app.use('/api', apiRoutes);

// Launch app to listen to specified port
https
    .createServer({
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert')
        },
        app
    )
    .listen(port, function() {
        console.log('Running Fireside Party Server on port ' + port);
    });