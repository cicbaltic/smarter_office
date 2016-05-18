var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

var model = 'temperatureWithHum';

exports.listAll = function (req, res) {

	temperatureWithHumDB.view(model, 'doc_by_zone_and_time_v1',  {limit: 100, reduce: true, group_level: 2}, function(err, body) {
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