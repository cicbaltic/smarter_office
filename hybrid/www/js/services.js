angular.module('starter.services', [])

.factory('TemperatureService',['$http', function($http) {
	var getData = function() {
		
		return $http.get("http://localhost:6001/api/temperatures")
		.then(function(response){
		  var result = response.data;
		  temperature =  result[0].doc.temperature;
		  return temperature;
		});
		
	};
  
	return {
		getTemperature : getData
	};
	
	
}])

.factory('HumidityService',['$http', function($http) {

	var humidity = 312;
	return {
		getHumidity : function() {
			return humidity;
		}
	};
}])

.factory('HumidityHistoryService',['$http', function($http) {

	var humidityHistory = [65, 59, 80, 81, 56, 55, 40];
	return {
		getTemperature : function() {
			return humidityHistory;
		}
	};
}])

.factory('TemperatureHistoryService',['$http', function($http) {

	var temperatureHistory =  [19, 21, 20, 18, 21, 17, 17];
	return {
		getTemperatureHistory : function() {
			return temperatureHistory;
		}
	};
}])


