// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('starter', ['ionic', 'starter.Directives',
		'starter.Controllers', 'starter.Services', 'chart.js', 'ngCordovaBeacon'])

.run(function ($ionicPlatform, $rootScope, $state) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the
            // accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It
            // stops the viewport
            // from snapping when text inputs are focused. Ionic handles this
            // internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, next, current) {
        if ($state.current.name === 'index') {
            $rootScope.$emit('indexRefresh');
        }
    });
})

.constant('Constants', {
    temperatureConst: 30,
    humidityConst: 100
})

.constant('ApiEndpoint', {
    url: 'http://localhost:8100/api'
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center')

    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/main.html',
                controller: 'indexController'
            }
        }
    })

    .state('app.ibeacon', {
        url: '/ibeacon',
        views: {
            'menuContent': {
                templateUrl: 'templates/ibeacon.html',
                controller: 'BeaconController'
            }
        }
    })

    .state('app.history', {
        url: '/history/:zoneId/:order',
        views: {
            'menuContent': {
                templateUrl: 'templates/history.html',
                controller: 'historyController'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
