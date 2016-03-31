var services = angular.module('starter.Services', []);

services.factory('TemperatureAndHumidityService', [
		'$http','ApiEndpoint',
		function($http, ApiEndpoint) {
			return {
				getTemperature : function() {
					return $http
					.get(
							ApiEndpoint.url
									+ '/temperaturesAndHumWithRange/2016-03-30/2016-03-30T23:59/1',
									{
										timeout: 5000
									}).then(
							function successCallback(response) {
								var messageSize = response.data.size;		
								var data = [];
								for(i = 0; i<messageSize; i++){
									if(data[ response.data.rows[i].zone_id ] == null){
										data[ response.data.rows[i].zone_id ]={
												temperature : response.data.rows[i].temp_v,
												humidity : response.data.rows[i].hum_v,
												zone : response.data.rows[i].zone_id,
												timestamp : response.data.rows[i].timestamp
											}
									}
									else if(data[ response.data.rows[i].zone_id ].timestamp < response.data.rows[i].timestamp){
										data[ response.data.rows[i].zone_id ]={
											temperature : response.data.rows[i].temp_v,
											humidity : response.data.rows[i].hum_v,
											zone : response.data.rows[i].zone_id,
											timestamp : response.data.rows[i].timestamp
										}
									}
								}
								var responseData = [];

								var i = 0;
								for (var dat in data) {

									responseData[i]=data[dat];
									 i++;
									}
								return responseData;
							}, function errorCallback(response) {
								return [];
							});
				}
			}
		}]);
			