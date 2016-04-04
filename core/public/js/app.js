var app = angular.module('smarterOfficeApp', ["chart.js"]);

app.controller('tempAndHumCtrl', function ($scope, $http, $interval) {
    'use strict';
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
                    data: [entry.temp_v, 50 - temp],
                    labels: ["Temperature", "Other"]
                };
                entry.options = {
                    showTooltips: false,
                    percentageInnerCutout: 70,
                    responsive: false
                };
                entry.formatedDate = moment(entry.date).format("YYYY-MM-DD HH:mm");
            });

        });
    };
    $scope.updateData();
    $interval($scope.updateData, 60000);

});