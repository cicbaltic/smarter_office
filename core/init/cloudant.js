var config = require('./../config');
var nano = require("nano")(config.dbUrl);
var smartOfficeEnvDB = nano.use('office_environment');

var _design = '_design/';

var designDocumentName = _design + 'temperatureWithHum';

var temperatureWithHum = require("./designDocuments/temperatureWithHum.js");

smartOfficeEnvDB.get(designDocumentName, { revs_info: true }, function(err, body) {
	if (!err) {
		console.log('Design document: ' + designDocumentName + ' was found.');
		smartOfficeEnvDB.destroy(designDocumentName, body._rev, function(err, body) {
			if (!err) {
				console.log('Design document: ' + designDocumentName + ' was removed from database.');
				insertDesignDocument(temperatureWithHum, designDocumentName);
			}
		});
	} else {
		console.log('Design document: ' + designDocumentName + ' not found.');
		insertDesignDocument(temperatureWithHum, designDocumentName);
	}
});

function insertDesignDocument(temprWithHum, docName) {
	smartOfficeEnvDB.insert(temprWithHum, docName, function(err, response){
		if(!err) {
			console.log('New design document: ' + docName + ' was created.');
		} else {
			console.log(err);
		}
	});
}