var services = angular.module('starter.Services', []);

services.factory('TemperatureAndHumidityService', [
		'$http',
		function($http) {
			return {
				getTemperature : function() {
					return  $http.get('js/mockData/temperaturesAndHum.json').then(
							function successCallback(response) {
								var messageSize = response.data.size;
								var data = [];
								for(i = 0; i<messageSize; i++){
									data[i]={
											temperature : response.data.rows[i].temp_v,
											humidity : response.data.rows[i].hum_v,
											zone : response.data.rows[i].zone_id
										}
								}
								return data;
							}, function errorCallback(response) {
								return [];
							});
				}
			}
		}]);
			