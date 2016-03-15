(function() {
    'use strict';
    angular
        .module('starter')
        .factory ('coreService', ['$http',
            function($http) {
                var coreService = {};

                coreService.tempAndHum = function(par, callback) {
                	// $http.get('./api/temperaturesAndHum/' + 
                		// par.step)
	                $http.get('js/mockData/temperaturesAndHum.json')
                    .then(function(result) {
                        callback(result);
                    },
                    function(err) {
                        callback(err);
                    });
                };
                
                coreService.tempAndHumWithRange = function(par, callback) {
                    // $http.get('./api/temperaturesAndHumWithRange/' + 
	                	// par.startsWith + '/' +
	                	// par.endsWith + '/' + 
	                	// par.step)
                	$http.get('js/mockData/temperaturesAndHumWithRange.json')
                    .then(function(result) {
                        callback(result);
                    },
                    function(err) {
                        callback(err);
                    });
                };
                
                coreService.tempAndHumWithZoneId = function(par, callback) {
                    $http.get('./api/temperaturesAndHumWithZoneId' + 
                    	par.zoneId)
                    .then(function(result) {
                        callback(result);
                    },
                    function(err) {
                        callback(err);
                    });
                };
                
                coreService.tempAndHumWithRangeAndZoneId = function(par, callback) {
                	// $http.get('./api/temperaturesAndHumWithRangeAndZoneId/' + 
	                	// par.startsWith + '/' + 
	                	// par.endsWith + '/' +
	                	// par.zoneId + '/' +
	                	// par.step)
                	$http.get('js/mockData/temperaturesAndHumWithRangeAndZoneId.json')
                    .then(function(result) {
                        callback(result);
                    },
                    function(err) {
                        callback(err);
                    });
                };  

                return coreService
            }])
        ;
})();
