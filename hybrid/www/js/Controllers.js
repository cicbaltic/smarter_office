var app = angular.module('starter.Controllers', []);

app.controller('historyController',
		function($scope, $stateParams, $ionicHistory,coreService,$filter) {
	
		$scope.zoneId = $stateParams.zoneId;
		$scope.order = $stateParams.order;
		var temperatureData = [[]];
		var temperatureLabels = [];
		var humidityData = [[]];
		var humidityLabels = [];
		coreService.tempAndHumWithRangeAndZoneId(null, function(response){
			var messageSize = response.data.size;
			var data = [];
			
			
				
			for(i = 0; i<messageSize; i++){
				temperatureData[0][i] = response.data.rows[i].temp_v;
				humidityData[0][i] = response.data.rows[i].hum_v;
				humidityLabels[i] = $filter('date')(response.data.rows[i].timestamp,"dd");
				temperatureLabels[i] = $filter('date')(response.data.rows[i].timestamp,"dd");
			}
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
		});
			
			$scope.goBack = function() {
				$ionicHistory.goBack();
			};
			var p1 = document.getElementById("rangeValue1");
			var res1 = document.getElementById("rangeValueText1");
			p1.addEventListener("input", function() {
				
				if(p1.value == 0){
					res1.innerHTML = "Days";
					$scope.firstGraphData = temperatureData;
					$scope.firstGraphLabels = temperatureLabels;
					$scope.$apply();
				}
				if(p1.value == 1){
					res1.innerHTML = "Hours";
					$scope.firstGraphData = humidityData;
					$scope.firstGraphLabels = humidityLabels;
					$scope.$apply();
					
				}
				if(p1.value == 2){
					res1.innerHTML = "Minutes";
					$scope.firstGraphData = temperatureData;
					$scope.firstGraphLabels = temperatureLabels;
					$scope.$apply();
				}
			}, false); 
			
			var p2 = document.getElementById("rangeValue2");
			var res2 = document.getElementById("rangeValueText2");
			p2.addEventListener("input", function() {
				if(p2.value == 0){
					res2.innerHTML = "Days";
					$scope.secondGraphData = temperatureData;
					$scope.secondGraphLabels = temperatureLabels;
					$scope.$apply();
				}
				if(p2.value == 1){
					res2.innerHTML = "Hours";
					$scope.secondGraphData = humidityData;
					$scope.secondGraphLabels = humidityLabels;
					$scope.$apply();
					
				}
				if(p2.value == 2){
					res2.innerHTML = "Minutes";
					$scope.secondGraphData = temperatureData;
					$scope.secondGraphLabels = temperatureLabels;
					$scope.$apply();
				}
			}, false); 
			
		});

app.controller('tempHumidityController', ['$scope','$timeout','Constants','$rootScope', '$timeout', 'colorService', 
                                          function($scope,timer, Constants, $rootScope, $timeout, colorService) {
	//back button bug fix
	$rootScope.$on('indexRefresh', function() {	
		$timeout(function(){
			draw();
		});
    });	
	
	$scope.zone = $scope.all.zone;

	
	var uniqueId = Date.now();
	$scope.temperatureId = "T" + uniqueId;
	$scope.humidityId = "H" + uniqueId;

	var temperature = $scope.all.temperature;
	var humidity = $scope.all.humidity;

	$scope.temperature = temperature;
	$scope.humidity = humidity;
	
	var draw = function() {

		var tempData = [ {
			value : temperature,
			color : colorService.tempColor(temperature)
		}, {
			value : Constants.temperatureConst - temperature,
			color : "#E2EAE9"
		} ];
	
		var humidityData = [ {
			value : humidity,
			color : colorService.humColor(humidity)
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
	       		 var fontsize = document.getElementById(chartIndex).offsetWidth/6;
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
	        		 var fontsize = document.getElementById(chartIndex).offsetWidth/6;
	        		 ctx.font = fontsize + "px Verdana";
	        		 ctx.textBaseline = "middle";
	        		 ctx.fillStyle = "black";
	        		 ctx.textAlign = "center";
	        		 ctx.fillText($scope.humidity+"%", cx, cy);
	            }
	            timer(hello, 0);
			}
		});	
	}
	draw();
}]);

app.controller('indexController', ['$scope','TemperatureAndHumidityService', function($scope, TemperatureAndHumidityService) {
		var myDataPromise = TemperatureAndHumidityService.getTemperature();
		myDataPromise.then(function(result) {
			$scope.noData = false;
			if (result.length === 0) {
				$scope.noData = true;
			}
			else{
				$scope.data = result;
			}
		});
		$scope.doRefresh = function() {
			myDataPromise.then(function(result) {
				$scope.noData = false;
				if (result.length === 0) {
					$scope.noData = true;
				}
				else{
					$scope.data = result;
				}
			});
			$scope.$broadcast("scroll.refreshComplete");
		} 
}]);
