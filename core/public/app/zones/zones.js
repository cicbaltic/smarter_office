angular.module('smarterOfficeApp.zones', [])
    .controller('tempAndHumCtrl', function ($scope, $http, $interval, $rootScope) {
        'use strict';
        if ($rootScope.updateHistoryPromise) {
            $interval.cancel($rootScope.updateHistoryPromise);
        }
        $scope.updateData = function () {
            $http.get("http://cicb-smarter-office.stage1.mybluemix.net/api/latestTemperaturesAndHumByZoneIds").then(function (response) {
                $scope.myData = response.data.rows;

                angular.forEach($scope.myData, function (entry) {
                    var hum = entry.hum_v,
                        temp = entry.temp_v,
                        day = moment(entry.date);
                    entry.humChart = {
                        data: [hum, 100 - hum],
                        labels: ["Humidity", "Other"]
                    };
                    entry.tempChart = {
                        data: [temp, 50 - temp],
                        labels: ["Temperature", "Other"]
                    };
                    entry.options = {
                        showTooltips: false,
                        percentageInnerCutout: 70,
                        responsive: false,
                        animateRotate: false,
                        animateScale: true
                    };
                    entry.formatedDate = moment(entry.date).format("YYYY-MM-DD HH:mm");
                    console.log(entry.formatedDate);
                });

            });
        };
        //console.log($rootScope);
        $scope.updateData();
        $rootScope.updateData = $scope.updateData;
        $rootScope.updatePromise = $interval($scope.updateData, 10000);

    });