var config = require('./../config');
var nano = require("nano")(config.dbUrl);
var smartOfficeEnvDB = nano.use('office_environment');
 
var temperatureWithHumName = 'temperatureWithHum';
var temperatureWithHumObj= require("./designDocuments/temperatureWithHum.js");


var temperatureWithHum = new CloudantDesignDoc(temperatureWithHumName, temperatureWithHumObj);
temperatureWithHum.createDesignObject();

var zones = new CloudantDesignDoc("zones", require("./designDocuments/zones.js"));
zones.createDesignObject();


function CloudantDesignDoc(designDocName, obj) {
	var _design = '_design/';
	this.docName = _design + designDocName;
	this.obj = obj;

	this.createDesignObject = function() {
		console.log(this.docName);
		var desgnDocName = this.docName;
		var desgnDocObj = this.obj;
		smartOfficeEnvDB.get(desgnDocName, { revs_info: true }, function(err, body) {
			if (!err) {
				console.log('Design document: ' + desgnDocName + ' was found.');
				smartOfficeEnvDB.destroy(desgnDocName, body._rev, function(err, body) {
					if (!err) {
						console.log('Design document: ' + desgnDocName + ' was removed from database.');
						insertDesignDocument(desgnDocName, desgnDocObj);
					}
				});
			} else {
				console.log('Design document: ' + desgnDocName + ' not found.');
				insertDesignDocument(desgnDocName, desgnDocObj);
			}
		});
	}

	insertDesignDocument = function(docName, obj) {
		smartOfficeEnvDB.insert(obj, docName, function(err, response){
			if(!err) {
				console.log('New design document: ' + docName + ' was created.');
			} else {
				console.log(err);
			}
		});
	}
}