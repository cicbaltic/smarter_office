var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('office_environment');

var step = 15*100;

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

exports.listAllWithStepInterval = function (req, res) {
	temperatureWithHumDB.viewWithList('temperatureWithHum', 'all_entries', 'all_entries_with_step',  {limit: 1000, interval: step}, function(err, body) {
		if (!err) {
			var temperatureWithHumList = [];
			body.rows.forEach(function (doc) {
				temperatureWithHumList.push(doc);
			});
			res.send(JSON.stringify(temperatureWithHumList));
		}
	});
}

exports.listByDatesInterval = function (req, res, params) {
	var step = params.step;
	if(step === undefined) {
		step = 15;
	} else {
		step = step * 1000;
	}
	if (isNaN(params.startWith) == false && isNaN(params.endWith) == false) {
		temperatureWithHumDB.viewWithList('temperatureWithHum', 'all_entries', 'all_entries_with_step',  {limit: 1000, interval: step, startkey: [params.startWith], endkey: [params.endWith]}, function(err, body) {
			if (!err) {
				var temperatureWithHumList = [];
				body.rows.forEach(function (doc) {
					temperatureWithHumList.push(doc);
				});
				res.send(JSON.stringify(temperatureWithHumList));
			}
		});
	} else {
		res.status(404).send();
	}
}