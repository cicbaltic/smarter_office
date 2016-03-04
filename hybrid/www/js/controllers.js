var app = angular.module('starter.controllers', []);

app.controller('mainController', function($scope, Temperatures, CurrentDate) {
	$scope.currentTime = CurrentDate.get();
	$scope.currentTemperature = Temperatures.getNewest();
	console.log('test');
});

app.controller('historyController', function($scope, Temperatures, CurrentDate) {

	var labels = [];
	var data = [];

	var temperatures = Temperatures.all();

	for (i = 0; i < temperatures.length; i++) {
		labels[i] = temperatures[i].captureDateTime;
		data[i] = temperatures[i].temperature;
	}
	
	$scope.currentTime = CurrentDate.get();
	$scope.labels = labels;
	$scope.data = [ data ];
});

app.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends : true
	};
});
