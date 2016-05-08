var config = require('./../../config');
var nano = require("nano")(config.dbUrl);
var temperatureWithHumDB = nano.use('temperature');

exports.listAll = function (req, res) {
res.send(JSON.stringify({
    "size": 3,
    "zones": [{
        "zone_id": "1",
        "zone_name": "Floor 4-1",
        "data": [{
            "timestamp": 1459403381003,
            "date": "2016-03-31T05:49:41.003Z",
            "oxygen": "75.20",
        },
        {
            "timestamp": 1459403382003,
            "date": "2016-03-31T05:49:42.003Z",
            "oxygen": "73.20",
        }]
    }, {
        "zone_id": "2",
        "zone_name": "Floor 3-1",
        "data": [{
            "timestamp": 1459294774074,
            "date": "2016-03-29T23:39:34.074Z",
            "oxygen": "63.30",
        }]
    }]
}));
};
