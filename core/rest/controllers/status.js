var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');