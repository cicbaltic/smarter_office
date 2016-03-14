var app = angular.module('starter.Controllers', []);

app.controller('historyController',
		function($scope, $stateParams, $ionicHistory) {
			$scope.zoneId = $stateParams.zoneId;
			$scope.order = $stateParams.order;

			var temperatureData = [ [ 16, 15, 20, 12, 16, 12, 8 ] ];
			var temperatureLabels = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
					'Sun' ];

			var humidityData = [ [ 55, 23, 45, 32, 65, 65, 21 ] ];
			var humidityLabels = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
					'Sun' ];

			if ($stateParams.order === 'T') {
				$scope.firstGraphTitle = 'Temperature';
				$scope.firstGraphData = temperatureData;
				$scope.firstGraphLabels = temperatureLabels

				$scope.secondGraphTitle = 'Humidity';
				$scope.secondGraphData = humidityData;
				$scope.secondGraphLabels = humidityLabels;
			} else {
				$scope.firstGraphTitle = 'Humidity';
				$scope.firstGraphData = humidityData;
				$scope.firstGraphLabels = humidityLabels

				$scope.secondGraphTitle = 'Temperature';
				$scope.secondGraphData = temperatureData;
				$scope.secondGraphLabels = temperatureLabels;
			}
			$scope.goBack = function() {
				$ionicHistory.goBack();
			};
		});

app.controller('tempHumidityController', ['$scope','$timeout','Constants', function($scope,timer, Constants) {
	$scope.zone = $scope.all.zone;

	var uniqueId = Date.now();
	$scope.temperatureId = "T" + uniqueId;
	$scope.humidityId = "H" + uniqueId;

	var temperature = $scope.all.temperature;
	var humidity = $scope.all.humidity;

	$scope.temperature = temperature;
	$scope.humidity = humidity;

	var tempData = [ {
		value : temperature,
		color : "#7CC7FF"
	}, {
		value : Constants.temperatureConst - temperature,
		color : "#E2EAE9"
	} ];

	var humidityData = [ {
		value : humidity,
		color : "#5AA700"
	}, {
		value : Constants.humidityConst - humidity,
		color : "#E2EAE9"
	} ];

	// below code should be changed. There should be another way to get element
	// by unique id, which is generated runtime..
	var ind = $scope.index * 2;
	var humidityIndex = ind + 1;

	var elem = document.getElementsByTagName('canvas')[ind];

	var ctx = elem.getContext("2d");
	ctx.canvas.width = 300;
	ctx.canvas.height = 300;

	new Chart(ctx).Doughnut(tempData, {
		animation : true,
		responsive : true,
		showTooltips : false,
		percentageInnerCutout : 80,
		segmentShowStroke : false,
		onAnimationComplete : function() {
			 var hello = function () {		          
           	 var chartIndex=$scope.temperatureId;      	
       		 var ctx = document.getElementById(chartIndex).getContext("2d");
       		 var cx = document.getElementById(chartIndex).offsetWidth / 2;
       	     var cy = document.getElementById(chartIndex).offsetHeight / 2;
       		 var fontsize = document.getElementById(chartIndex).offsetWidth/5;
       		 ctx.font = fontsize + "px Verdana";
       		 ctx.textBaseline = "middle";
       		 ctx.fillStyle = "black";
       		 ctx.textAlign = "center";
       		 ctx.fillText($scope.temperature+"°C", cx, cy);    		 
           }
           timer(hello, 0);
		}
	});

	var elem2 = document.getElementsByTagName('canvas')[humidityIndex];

	var ctx2 = elem2.getContext("2d");
	ctx2.canvas.width = 300;
	ctx2.canvas.height = 300;

	new Chart(ctx2).Doughnut(humidityData, {
		animation : true,
		responsive : true,
		showTooltips : false,
		percentageInnerCutout : 80,
		segmentShowStroke : false,
		onAnimationComplete : function() {
			 var hello = function () {    
        		 var chartIndex=$scope.humidityId;	    
        		 var ctx = document.getElementById(chartIndex).getContext("2d");
        		 var cx = document.getElementById(chartIndex).offsetWidth / 2;
        	     var cy = document.getElementById(chartIndex).offsetHeight / 2;
        		 var fontsize = document.getElementById(chartIndex).offsetWidth/5;
        		 ctx.font = fontsize + "px Verdana";
        		 ctx.textBaseline = "middle";
        		 ctx.fillStyle = "black";
        		 ctx.textAlign = "center";
        		 ctx.fillText($scope.humidity+"%", cx, cy);
            }
            timer(hello, 0);
		}
	});
}]);

app.controller('indexController', function($scope, TemperatureAndHumidityService) {

	var data = TemperatureAndHumidityService.getData();

	$scope.noData = false;
	if (data.length === 0) {
		$scope.noData = true;
	}

	$scope.data = data;
});
