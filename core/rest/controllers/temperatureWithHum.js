var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

var step = 15*1000;
var limit = 1000;
var model = 'temperatureWithHum';

exports.listAll = function (req, res) {
	temperatureWithHumDB.list({include_docs: true}, function (err, body) {
		if (!err) {
			var temperatureList = [];
			body.rows.forEach(function (doc) {
				temperatureList.push(doc);
			});
			res.send(JSON.stringify(temperatureList));
		}
	});
};

exports.listAllWithStep = function (req, res) {
	var stepInSec = step;
	if(req.params.step !== undefined) {
		stepInSec = req.params.step * 1000;
	}

	temperatureWithHumDB.viewWithList(model, 'doc_by_time', 'doc_with_range',  {limit: limit, interval: stepInSec}, function(err, body) {
		if (!err) {
			var temperatureWithHumList = [];
			body.rows.forEach(function (doc) {
				temperatureWithHumList.push(doc);
			});
			res.send(JSON.stringify({
				'size': temperatureWithHumList.length,
				'rows': temperatureWithHumList

			}));
		} else {
			console.log(err);
		}
	});
}

exports.listByRange = function (req, res) {
	var startsWith = new Date(req.params.startsWith).getTime();
	var endsWith = new Date(req.params.endsWith).getTime();
	var stepInSec = step;
	if(req.params.step !== undefined) {
		stepInSec = req.params.step * 1000;
	}

	var zoneId = '';
	if(req.params.zoneId !== undefined) {
		zoneId = req.params.zoneId;
	}

	if (isNaN(startsWith) == false && isNaN(endsWith) == false) {
		temperatureWithHumDB.viewWithList(model, 
			'doc_by_time', 'doc_with_range',  
			{limit: limit, interval: stepInSec, startkey: [startsWith], endkey: [endsWith], zoneId: zoneId}, 
			function(err, body) {
			if (!err) {
				var temperatureWithHumList = [];
				body.rows.forEach(function (doc) {
					temperatureWithHumList.push(doc);
				});
				res.send(JSON.stringify({
					'size': temperatureWithHumList.length,
					'rows': temperatureWithHumList

				}));
			} else {
				console.log(err);
			}
		});
	} else {
		res.status(404).send();
	}
}

exports.listByZoneId = function (req, res) {
	var zoneId = req.params.zoneId;
	if(zoneId === undefined) {
		res.status(404).send();
	} else {

		var arrayOfZoneIds = zoneId.split(',');
		var zoneIds = [];
		arrayOfZoneIds.forEach(function(entry) {
			zoneIds.push([
				entry
				]);
		});

		temperatureWithHumDB.view(model, 'doc_by_zoneId',  {limit: limit, interval: step, keys: zoneIds}, function(err, body) {
			if (!err) {
				var temperatureWithHumList = [];
				body.rows.forEach(function (doc) {
					temperatureWithHumList.push(doc);
				});
				res.send(JSON.stringify({
					'size': temperatureWithHumList.length,
					'rows': temperatureWithHumList

				}));
			} else {
				console.log(err);
			}
		});
	}
}

exports.listByZoneIdAndRange = exports.listByRange;
