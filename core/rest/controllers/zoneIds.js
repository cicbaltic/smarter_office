var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var zonesDB = nano.use('office_environment');

var model = 'zones';


exports.listAll = function (req, res) {
	zonesDB.view(model, 'all_entries',{group: true}, function(err, body) {
		if (!err) {
			var zoneList = [];
			body.rows.forEach(function (doc) {
				zoneList.push(doc);
			});
			res.send(JSON.stringify({
				'size': zoneList.length,
				'rows': zoneList

			}));
		} else {
			console.log(err);
		}
	});
}