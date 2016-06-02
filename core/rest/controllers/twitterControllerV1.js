var config = require('./../../config');
var Twitter = require('twitter');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

var model = 'temperatureWithHum';

console.log(config);

var client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

exports.postTempWithHum = function (req, res) {
	var zoneId = req.params.zoneId;
	var greeting = req.params.greeting;

	temperatureWithHumDB.viewWithList(model, 'latest_doc_by_zone', 'latest_doc_by_zone', {limit: 1, group: true}, function(err, body) {
		if (!err) {
			var jDoc = {};
			body.rows.forEach(function (doc) {
				if(doc.zone_id == zoneId) {
					jDoc = doc;
				}
			});

			if(typeof jDoc === 'object') {
				var fGreeting = generateTwitterTempWithHumMessage(greeting, jDoc.temp_v, jDoc.hum_v);

				client.post('statuses/update', {status: fGreeting}, function(error, tweet, response) {
				  if (!error) {
				    res.json({
						temp_v: jDoc.temp_v,
						hum_v: jDoc.hum_v,
						greeting: greeting,
						tweet: fGreeting
					});
					console.log(fGreeting);
				  } else {
				  	res.json({
						errorMessage: error
					});
				  	console.log(err);
				  }
				});
			} else {
				res.json(400, {error: 'Tempterature with hum not found for this zone'});
			}
		} else {
			console.log(err);
		}
	});
}

function generateTwitterTempWithHumMessage(message, temp, hum) {
	message = message.replace("*temp*", temp); 
	message = message.replace("*hum*", hum); 
	return message;
}