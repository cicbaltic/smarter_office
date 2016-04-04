var app = angular.module('starter.Controllers', []);

app.controller('historyController',
		function($scope, $stateParams, $ionicHistory,coreService,$filter) {

		$scope.data = [];
		$scope.zoneId = $stateParams.zoneId;
		$scope.order = $stateParams.order;
		$scope.data.tempScaleButton = '0';
		$scope.data.humScaleButton = '0';

		var currentTempDate = new Date();
		var currentHumDate = new Date();
		var zeroHourDate = new Date(0);
		zeroHourDate.setHours(0);
		zeroHourDate.setMinutes(0);
		
		$scope.data.fromTempTime = zeroHourDate;
		$scope.data.toTempTime = new Date();
		$scope.data.fromTempDate = new Date(currentTempDate.setDate(currentTempDate.getDate()-7));
		$scope.data.toTempDate = new Date();

		$scope.data.fromHumTime = zeroHourDate;
		$scope.data.toHumTime =  new Date();
		$scope.data.fromHumDate = new Date(currentHumDate.setDate(currentHumDate.getDate()-7));
		$scope.data.toHumDate = new Date();

		coreService.tempAndHumWithRangeAndZoneId(null, function(response){
			var temperatureData = [[]];
			var humidityData = [[]];
			var tempFilterString;
			var humFilterString;
			var changeType;
			var loadAll = true;

			$scope.dateFilter = function (ct) {

				changeType = ct;
				temperatureData = [[]];
				tempLabels = [];
				humLabels = [];
				humidityData = [[]];

				$scope.data.tempScaleButton === '0' ? tempFilterString = 'dd' : tempFilterString = 'HH';
				$scope.data.humScaleButton === '0' ? humFilterString = 'dd' : humFilterString = 'HH';

				var drawTemp = function() {
					if (changeType === 'temp' || loadAll) {
						var fromDate = $scope.data.fromTempDate.setHours($scope.data.fromTempTime.getHours(), $scope.data.fromTempTime.getMinutes(), 0);
						var toDate = $scope.data.toTempDate.setHours($scope.data.toTempTime.getHours(), $scope.data.toTempTime.getMinutes(), 0);


						for (i = 0, size = response.data.size; i < size; i++) {
							var row = $filter('date')(response.data.rows[i].date, tempFilterString);

							if (fromDate < response.data.rows[i].timestamp && toDate > response.data.rows[i].timestamp) {
								var labelIndex = tempLabels.indexOf(row);
								if (tempLabels[tempLabels.length - 1] === row) {
									temperatureData[0][labelIndex] = (parseInt(temperatureData[0][labelIndex]) + parseInt(response.data.rows[i].temp_v))/2;
								} else {
									temperatureData[0].push(parseInt(response.data.rows[i].temp_v));
									tempLabels.push($filter('date')(response.data.rows[i].date, tempFilterString));
								}
							}
						}
					}
					$scope.firstGraphTitle = 'Temperature';
					$scope.firstGraphData = temperatureData;
					$scope.firstGraphLabels = tempLabels
				}

				var drawHum = function() {
					if (changeType === 'hum' || loadAll) {
						var fromDate = $scope.data.fromHumDate.setHours($scope.data.fromHumTime.getHours(), $scope.data.fromHumTime.getMinutes(), 0);
						var toDate = $scope.data.toHumDate.setHours($scope.data.toHumTime.getHours(), $scope.data.toHumTime.getMinutes(), 0);

						for (i = 0, size = response.data.size; i < size; i++) {
							var row = $filter('date')(response.data.rows[i].date, humFilterString);

							if (fromDate < response.data.rows[i].timestamp && toDate > response.data.rows[i].timestamp) {
								var labelIndex = humLabels.indexOf(row);

								if (humLabels[humLabels.length - 1] === row) {
									humidityData[0][labelIndex] = (parseInt(humidityData[0][labelIndex]) + parseInt(response.data.rows[i].hum_v))/2;
								} else {
									humidityData[0].push(parseInt(response.data.rows[i].hum_v));
									humLabels.push($filter('date')(response.data.rows[i].date, humFilterString));
								}
							}
						}
					}
					$scope.secondGraphTitle = 'Humidity';
					$scope.secondGraphData = humidityData;
					$scope.secondGraphLabels = humLabels;
				}

				if ($stateParams.order === 'T') {
					if (changeType === 'temp' || loadAll) {
						drawTemp();
					}
					if (changeType === 'hum' || loadAll) {
						drawHum();
						loadAll = false;
					}

				} else {
					if (changeType === 'hum' || loadAll) {
						drawHum();
					}
					if (changeType === 'temp' || loadAll) {
						drawTemp();
						loadAll = false;
					}
				}
			}

			var p1 = document.getElementById("rangeValue1");
			var res1 = document.getElementById("rangeValueText1");
			p1.addEventListener("input", function() {

				if(p1.value == 0){
					res1.innerHTML = "Days";
					$scope.dateFilter('temp');
					$scope.$apply();
				}
				if(p1.value == 1){
					res1.innerHTML = "Hours";
					$scope.dateFilter('temp');
					$scope.$apply();

				}
				if(p1.value == 2){
					res1.innerHTML = "Minutes";
					$scope.dateFilter('temp');
					$scope.$apply();
				}
			}, false);

			var p2 = document.getElementById("rangeValue2");
			var res2 = document.getElementById("rangeValueText2");
			p2.addEventListener("input", function() {
				if(p2.value == 0){
					res2.innerHTML = "Days";
					$scope.dateFilter('hum');
					$scope.$apply();
				}
				if(p2.value == 1){
					res2.innerHTML = "Hours";
					$scope.dateFilter('hum');
					$scope.$apply();

				}
				if(p2.value == 2){
					res2.innerHTML = "Minutes";
					$scope.dateFilter('hum');
					$scope.$apply();
				}
			}, false);

			$scope.dateFilter();

		});

			$scope.goBack = function() {
				$ionicHistory.goBack();
			};



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
				$scope.datasize = result.length;
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
					$scope.datasize = result.length;
				}
			});
			$scope.$broadcast("scroll.refreshComplete");
		}
}]);
