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

// adding CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var temperatureOnlyController = require('./rest/controllers/temperatureOnly');
app.get('/api/temperatures/step/:step?', temperatureOnlyController.listAllWithStep);
app.get('/api/temperatures/zone/:zoneId', temperatureOnlyController.listByZoneId);
app.get('/api/temperatures/from/:startsWith/to/:endsWith/step/:step?', temperatureOnlyController.listByRange);
app.get('/api/temperatures/from/:startsWith/to/:endsWith/zone/:zoneId/step/:step?', temperatureOnlyController.listByZoneIdAndRange);

var temperatureWithHumController = require('./rest/controllers/temperatureWithHum');
app.get('/api/temperaturesAndHum/:step?', temperatureWithHumController.listAllWithStep);
app.get('/api/temperaturesAndHumWithRangeAndZoneId/:startsWith/:endsWith/:step?', temperatureWithHumController.listByRange);
app.get('/api/temperaturesAndHumWithZoneId/:zoneId', temperatureWithHumController.listByZoneId);
app.get('/api/latestTemperaturesAndHumByZoneIds', temperatureWithHumController.latestTemperaturesAndHumByZoneIds);

var zoneController = require('./rest/controllers/zoneIds');
app.get('/api/zones', zoneController.listAll);




//New api version for oxygen
var oxygenController = exports.oxygenController = require('./rest/controllers/oxygen');
app.get('/api/v1/oxygen/', oxygenController.listAll);
app.get('/api/v1/oxygen/:zoneIds', oxygenController.listAll);
app.get('/api/v1/oxygen/:startsWith/:endsWith', oxygenController.listAll);
app.get('/api/v1/oxygen/:startsWith/:endsWith/:zoneIds', oxygenController.listAll);


//New api version for noise
var noiseController = exports.noiseController = require('./rest/controllers/noise');
app.get('/api/v1/noise', noiseController.listAll);
app.get('/api/v1/noise/:zoneIds', noiseController.listAll);
app.get('/api/v1/noise/:startsWith/:endsWith', noiseController.listAll);
app.get('/api/v1/noise//:startsWith/:endsWith/:zoneIds', noiseController.listAll);

//New api version for temperature and Hum
var temperatureWithHumControllerV1 = require('./rest/controllers/temperatureWithHumV1');
app.get('/api/v1/temperatureWithHum', temperatureWithHumControllerV1.listAll);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});