var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureDB = nano.use('office_environment');

var step = 15*1000;
var limit = 1000;
var model = 'temperatureOnly';


exports.listAllWithStep = function (req, res) {
	var stepInSec = getStep(req);
	var params = {
		limit: limit,
		interval: stepInSec
	};
	temperatureDB.viewWithList(model, 'doc_by_time', 'doc_with_range', params, function(err, body) {
		if (err) {
			console.log(err);
			res.status(500).send('Internal error occured.');
		}
		res.send(getAsJsonList(body));
	});
}

exports.listByRange = function (req, res) {
	var startsWith = getStartTime(req);
	var endsWith = getEndTime(req);
	var stepInSec = getStep(req);
	var zoneId = getZoneId(req);

	var params = {
		limit: limit,
		interval: stepInSec,
		startkey: [startsWith],
		endkey: [endsWith],
		zoneId: zoneId
	};

	if (isRangeValid(startsWith, endsWith)) {
		temperatureDB.viewWithList(model, 'doc_by_time', 'doc_with_range', params, function(err, body) {
			if (err) {
				console.log(err);
				res.status(500).send('Internal error occured.');
			}
			res.send(getAsJsonList(body));
		});
	} else {
		res.status(404).send('Time range is not valid.');
	}
}

exports.listByZoneId = function (req, res) {
	var zoneId = req.params.zoneId;
	if(zoneId === undefined) {
		res.status(404).send('Zone ID is not defined.');
	}
	var zoneIds = getZoneIdList(zoneId);

	var params = {
		limit: limit,
		interval: step,
		keys: zoneIds
	};

	temperatureDB.view(model, 'doc_by_zoneId',  params, function(err, body) {
		if (err) {
			console.log(err);
			res.status(500).send('Internal error occured.');
		}
		res.send(getAsJsonList(body));
	});
}

exports.listByZoneIdAndRange = exports.listByRange;

function isRangeValid(startsWith, endsWith) {
	return isNaN(startsWith) == false && isNaN(endsWith) == false;
}

function getStep(req) {
	if (req.params.step !== undefined) {
		return req.params.step * 1000;
	}
	return step;
}

function getStartTime(req) {
	return new Date(req.params.startsWith).getTime();
}

function getEndTime(req) {
	return new Date(req.params.endsWith).getTime();
}

function getZoneId(req) {
	if (req.params.zoneId !== undefined) {
		return req.params.zoneId;
	}
	return '';
}

function getAsJsonList(body) {
	var temperatureOnlyList = [];
	body.rows.forEach(function (doc) {
		temperatureOnlyList.push(doc);
	});

	return JSON.stringify({
		'size': temperatureOnlyList.length,
		'rows': temperatureOnlyList
	});
}

function getZoneIdList(zoneId) {
	var arrayOfZoneIds = zoneId.split(',');
	var zoneIds = [];
	arrayOfZoneIds.forEach(function (entry) {
		zoneIds.push([entry]);
	});
	return zoneIds;
}
