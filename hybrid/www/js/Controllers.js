var app = angular.module('starter.Controllers', []);

app.controller('historyController', function($scope, $stateParams) {
	$scope.zoneId = $stateParams.zoneId;
	$scope.order = $stateParams.order;
});

app.controller('tempHumidityController', ['$scope','$timeout',  function($scope,timer) {
	$scope.zone = $scope.all.zone;

	var uniqueId = Date.now();
	$scope.temperatureId = "T" + uniqueId;
	$scope.humidityId = "H" + uniqueId;

	var temperature = $scope.all.temperature;
	var humidity = $scope.all.humidity;

	// constants
	var topTemperature = 30;
	var topHumidity = 100;

	$scope.temperature = temperature;
	$scope.humidity = humidity;

	var tempData = [ {
		value : temperature,
		color : "#7CC7FF"
	}, {
		value : topTemperature - temperature,
		color : "#E2EAE9"
	} ];

	var humidityData = [ {
		value : humidity,
		color : "#5AA700"
	}, {
		value : topHumidity - humidity,
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

app.controller('indexController', function($scope) {

	$scope.data = [ {
		temperature : 20,
		humidity : 70,
		zone : 142
	}, {
		temperature : 10,
		humidity : 80,
		zone : 112
	}, {
		temperature : 26,
		humidity : 45,
		zone : 321
	} ];

});
