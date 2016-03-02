/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var router = express.Router();

// ROUTES FOR REST API
router.get('/', function (req, res) {
    res.json({
        message: 'hooray!welcome to our api!'
    });
});

// register api routes
app.use('/api', router);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// register api routes
app.use('/api', router);

var temperatureController = require('./rest/controllers/temperature');
app.get('/api/temperatures', temperatureController.listAll);

var temperatureWithHumController = require('./rest/controllers/temperatureWithHum');
app.get('/api/temperaturesWithHum', temperatureWithHumController.listAllWithStepInterval);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});