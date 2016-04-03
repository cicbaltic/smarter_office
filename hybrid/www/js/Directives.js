var app = angular.module('starter.Directives', []);

myApp.directive('tempHumSingleData', ['$timeout', function(timer) {
	return {
		restrict : "E",
		replace : true,
		transclude : true,
		templateUrl : 'templates/areaTemperatureHumiditySingleData.html',
		scope : {
			index : '=index',
			all : '=alldata'
		},
		
		controller : 'tempHumidityController'
	};
}]);

myApp.directive('tempHumMultipleData', ['$timeout', function(timer) {
	return {
		restrict : "E",
		replace : true,
		transclude : true,
		templateUrl : 'templates/areaTemperatureHumidityMultipleData.html',
		scope : {
			index : '=index',
			all : '=alldata'
		},
		
		controller : 'tempHumidityController'
	};
}]);