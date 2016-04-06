angular.module('smarterOfficeApp', ['chart.js',
    'ui.router',
    'smarterOfficeApp.zones',
    'smarterOfficeApp.mobile-app',
    'smarterOfficeApp.history',
    'smarterOfficeApp.header'
    ]).
config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/zones');

    $stateProvider.state('zones', {
        url: '/zones',
        templateUrl: 'app/zones/zones.html'
    }).state('history', {
        url: '/history',
        templateUrl: 'app/history/history.html'
    }).state('mobile-app', {
        url: '/mobile-app',
        templateUrl: 'app/mobile-app/mobile-app.html'
    });

}]);