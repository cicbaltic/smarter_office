var app = angular.module('starter.Directives', []);

myApp.directive('tempHum', ['$timeout', function(timer) {
	return {
		restrict : "E",
		replace : true,
		transclude : true,
		templateUrl : 'templates/zoneTemperatureHumidity.html',
		scope : {
			index : '=index',
			all : '=alldata'
		},
		
		controller : 'tempHumidityController'
	};
}]);