angular.module('smarterOfficeApp.header', [])
    .controller('headerCtrl', function ($scope, $location) {
        'use strict';
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

    });