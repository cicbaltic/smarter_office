var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureDB = nano.use('temperature');

exports.listAll = function (req, res) {
	temperatureDB.list({include_docs: true}, function (err, body) {
		if (!err) {
			var temperatureList = [];
			body.rows.forEach(function (doc) {
				temperatureList.push(doc);
			});
			res.send(JSON.stringify(temperatureList));
		}
	});
};
