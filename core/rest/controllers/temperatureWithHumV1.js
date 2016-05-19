var config = require('./../../config');
var async = require("async");
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

var model = 'temperatureWithHum';
var listOfZones = ["1", "2"];

exports.listAll = function (req, res) {
/*	var startsWith = new Date('2016-04-01').getTime()/1000;
	var endsWith = new Date('2016-05-01').getTime()/1000;*/
	var startsWith = undefined;
	var endsWith = undefined;

	var f = function(key, params) {
		return function(callback){
			execute(key, params, callback);
		};
	}

	var listOfParallelAction = [];
	listOfZones.forEach(function(entry) {
		listOfParallelAction.push(f(entry, generateParameters(entry, startsWith, endsWith)));
	});

	async.parallel(listOfParallelAction,
		function(err, results){
			var size = results.length;
			res.send(JSON.stringify(generateRespond(listOfZones, results)));
		}
	);
}

function cleanRespond(result) {
	var cleanedData = [];
	result.forEach(function(element, index, array) {
		cleanedData.push({
			"timestamp": element.value.time_index,
			/*"date": new Date(element.value.time_index*1000),*/
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

function execute(key, params, callback) {
	var parameters = {};
	if(params != undefined && params != null) {
		for(var propertyName in params) {
			parameters[propertyName] = params[propertyName];
		}
	} 
	parameters['limit'] = 336;
	parameters['reduce'] = true;
	parameters['group_level'] = 2;	
	parameters['descending'] = true;

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