var config = require('./../config');
var nano = require("nano")(config.dbUrl);
var smartOfficeEnvDB = nano.use('office_environment');

var _design = '_design/';

var designDocumentName = _design + 'temperatureWithHumView';

var temperatureWithHumView = require("./designDocuments/temperatureWithHumView.js");


//register views, list, map/reduce functions

var documents = {
	views: {
		allEntries: {
			map: temperatureWithHumView
		}
	}
}

smartOfficeEnvDB.get(designDocumentName, { revs_info: true }, function(err, body) {
	if (!err) {
		console.log('Design document: ' + designDocumentName + ' was found.');
		smartOfficeEnvDB.destroy(designDocumentName, body._rev, function(err, body) {
			if (!err) {
				console.log('Design document: ' + designDocumentName + ' was removed from database.');
				insertDesignDocument();
			}
		});
	} else {
		console.log('Design document: ' + designDocumentName + ' not found.');
		insertDesignDocument();
	}
});

function insertDesignDocument() {
	smartOfficeEnvDB.insert(documents, designDocumentName, function(err, response){
		if(!err) {
			console.log('New design document: ' + designDocumentName + ' was created.');
		}
	});
}