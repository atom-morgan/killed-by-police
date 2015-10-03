//BASE SETUP

//PACKAGES
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'), //used to see requests
    mongoose = require('mongoose'),
    config = require('./config'),
    path = require('path');

//APP CONFIGURATION
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

//log all requests to console
app.use(morgan('dev'));

//connect to database
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

//REGISTER ROUTES
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//CATCHALL ROUTE - SENDS USERS TO FRONTEND
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//START THE SERVER
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
