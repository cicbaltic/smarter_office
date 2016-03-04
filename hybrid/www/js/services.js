var app = angular.module('starter.services', []);

app.factory('RestAPI', function($http, APIEndpoints) {
	return {
		getTemperature : function() {
			return $http.get(APIEndpoints.temperatureURL).then(
					function successCallback(response) {
						return response.data[0].doc;
					}, function errorCallback(response) {
						return [];
					});
		}
	}
});

app.factory('Temperatures', function() {
	// var temperatures = function() {
	// RestAPI.getTemperature().then(function(temp) {
	// temp;
	// }, function(temp) {
	// [];
	// })
	// };

	var temperatures = [ {
		id : 0,
		temperature : 20,
		captureDateTime : "2016-01-01 10:25:33"
	}, {
		id : 1,
		temperature : 21,
		captureDateTime : "2016-01-02 12:25:33"
	}, {
		id : 2,
		temperature : 22,
		captureDateTime : "2016-01-03 13:25:33"
	}, {
		id : 3,
		temperature : 10,
		captureDateTime : "2016-01-04 13:25:33"
	}, {
		id : 4,
		temperature : 11,
		captureDateTime : "2016-01-05 13:25:33"
	} ];

	return {
		all : function() {
			return temperatures;
		},
		getNewest : function() {
			if (temperatures.length > 0) {
				return temperatures[temperatures.length - 1];
			}
			return null;
		}
	};
});

app.factory('CurrentDate', function() {
	var date = new Date();
	month = '' + (date.getMonth() + 1);
	day = '' + date.getDate();
	year = date.getFullYear();

	if (month.length < 2) {
		month = '0' + month;
	}
	if (day.length < 2) {
		day = '0' + day;
	}

	return {
		get : function() {
			return [ year, month, day ].join('/');
		}
	}
});
