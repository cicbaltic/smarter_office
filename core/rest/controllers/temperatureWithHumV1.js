var config = require('./../../config');
var async = require("async");
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

var model = 'temperatureWithHum';

var listOfZones = ["1", "2"];

exports.listAll = function (req, res) {
	var limit = req.query.limit;
	execute(listOfZones, undefined, undefined, limit, res);
}

exports.listByZone = function (req, res) {
	var limit = req.query.limit;
	var zoneId = req.params.zoneIds;
	execute(["" + zoneId + ""], undefined, undefined, limit, res);
}

exports.listByRange = function (req, res) {
	var limit = req.query.limit;
	var startsWith = new Date(req.params.startsWith).getTime()/1000;
	var endsWith = new Date(req.params.endsWith).getTime()/1000;
	execute(listOfZones, startsWith, endsWith, limit, res);
}

exports.listByRangeAndZoneId = function (req, res) {
	var limit = req.query.limit;
	var zoneId = req.params.zoneIds;
	var startsWith = new Date(req.params.startsWith).getTime()/1000;
	var endsWith = new Date(req.params.endsWith).getTime()/1000;
	execute(["" + zoneId + ""], startsWith, endsWith, limit, res);
}

function execute(zones, startsWith, endsWith, limit, res) {
	var listOfParallelAction = [];
	zones.forEach(function(entry) {
		var parameters = generateParameters(entry, startsWith, endsWith);
		if(limit != undefined && limit != null) {
			parameters["limit"] = limit;
		}
		listOfParallelAction.push(f(entry, parameters));
	});

	async.parallel(listOfParallelAction,
		function(err, results){
			var size = results.length;
			res.json(generateRespond(zones, results));
		}
	);	
}

var f = function(key, params) {
	return function(callback){
		executeQuery(key, params, callback);
	};
}

function cleanRespond(result) {
	var cleanedData = [];
	result.forEach(function(element, index, array) {
		cleanedData.push({
			"timestamp": element.value.time_index,
			"date": new Date(element.value.time_index*1000),
            "temp_v": element.value.temp_v,
            "hum_v": element.value.hum_v
		});
	});
	return cleanedData.reverse();
}

function generateRespond(zones, results) {
	var respond = {};
	respond["zones"] = [];
	zones.forEach(function(element, index, array) {
		respond["zones"].push({
			"zone_id": element,
			"data": cleanRespond(results[index])
		});
	});
	return respond;
}

function generateParameters(zone, startDate, endDate) {
	if(startDate == undefined || startDate == null || endDate == undefined || endDate == null) {
		return {
			startkey: [zone, {}],
			endkey: [zone]
		};
	} else {
		return {
			startkey: [zone, endDate, {}],
			endkey: [zone, startDate]
		};
	}
}

function executeQuery(key, params, callback) {
	var parameters = {};
	parameters['limit'] = 336;
	parameters['reduce'] = true;
	parameters['group_level'] = 2;	
	parameters['descending'] = true;
	if(params != undefined && params != null) {
		for(var propertyName in params) {
			parameters[propertyName] = params[propertyName];
		}
	} 

	temperatureWithHumDB.view(model, 'doc_by_zone_and_time_v1', parameters, function(err, body) {
		if (!err) {
			var temperatureWithHumList = [];
			body.rows.forEach(function (doc) {
				temperatureWithHumList.push(doc);
			});
			console.log(key + ": " + new Date());
			callback(null, temperatureWithHumList);
		} else {
			console.log(err);
		}
	});
}