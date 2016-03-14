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
		
		controller : 'tempHumidityController'/*,
		  link: function (scope, elem, attrs, ctrl) {
	            var hello = function () {
	          
	            	 var chartIndex=scope.temperatureId;
	            	
	        		 var ctx = document.getElementById(chartIndex).getContext("2d");
	        		 var cx = document.getElementById(chartIndex).offsetWidth / 2;
	        	     var cy = document.getElementById(chartIndex).offsetHeight / 2;
	        		 var fontsize = 15;
	        		 ctx.font = fontsize + "px Verdana";
	        		 ctx.textBaseline = "middle";
	        		 ctx.fillStyle = "black";
	        		 ctx.textAlign = "center";
	        		 ctx.fillText(scope.temperature+"°C", cx, cy);
	        		 
	        		 var chartIndex=scope.humidityId;
		            	
	        		 var ctx = document.getElementById(chartIndex).getContext("2d");
	        		 var cx = document.getElementById(chartIndex).offsetWidth / 2;
	        	     var cy = document.getElementById(chartIndex).offsetHeight / 2;
	        		 var fontsize = 15;
	        		 ctx.font = fontsize + "px Verdana";
	        		 ctx.textBaseline = "middle";
	        		 ctx.fillStyle = "black";
	        		 ctx.textAlign = "center";
	        		 ctx.fillText(scope.humidity+"%", cx, cy);
	            }
	            timer(hello, 2000);
		  }*/
	};
}]);