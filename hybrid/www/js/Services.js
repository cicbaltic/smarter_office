var services = angular.module('starter.Services', []);

services.factory('TemperatureAndHumidityService', [
		'$http',
		function($http) {
//			var getData = function() {
//
//				return $http.get("http://localhost:6001/api/temperatures")
//						.then(function(response) {
//							var result = response.data;
//							temperature = result[0].doc.temperature;
//							return temperature;
//						});
//
//			};
			
			var data = [ {
				temperature : 20,
				humidity : 10,
				zone : 142
			}, {
				temperature : 10,
				humidity : 15,
				zone : 112
			}, {
				temperature : 26,
				humidity : 29,
				zone : 321
			}, {
				temperature : 30,
				humidity : 30,
				zone : 321
			} ];
			
			var data2 = [];

			return {
				getData : function() { return data; }
			};

		} ]);