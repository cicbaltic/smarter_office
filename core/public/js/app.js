var app = angular.module('smarterOfficeApp', ["chart.js", 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/zones');

    $stateProvider.state('zones', {
        url: '/zones',
        templateUrl: 'partial-zones.html'
    }).state('history', {
        url: '/history',
        templateUrl: 'partial-history.html'
    });

});


app.controller('tempAndHumCtrl', function ($scope, $http, $interval, $rootScope) {
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

app.controller('historyCtrl', function ($scope, $http, $interval, $rootScope) {
    'use strict';
    if ($rootScope.updatePromise) {
        $interval.cancel($rootScope.updatePromise);
    }
    $scope.updateHistoryData = function () {
        $http.get("http://cicb-smarter-office.stage1.mybluemix.net/api/temperaturesAndHum/15").then(function (response) {
            var histData = response.data.rows;
            $scope.labels = [];
            $scope.series = ['Temperature', 'Humidity'];
            $scope.data = [
                [],
                []
              ];
            $scope.options = {
                scaleFontColor: "#FFF",
                scaleGridLineColor: "rgba(255,255,255,.3)",
                scaleLineColor: "rgba(255,255,255,.3)",

            };
            console.log(response);
            var i = -1;
            var tempObj = {
                values: new Array(),
                sum: [],
                avgs: []
            };
            var humObj = {
                values: new Array(),
                sum: [],
                avgs: []
            };
            angular.forEach(histData, function (entry) {
                var hum = entry.hum_v,
                    temp = entry.temp_v;
                if ($scope.labels.indexOf(moment(entry.date).format("YYYY-MM-DD")) === -1) {
                    if (i >= 0) {
                        tempObj.avgs.push((tempObj.sum[i] / tempObj.values[i].length).toFixed(2));
                        humObj.avgs.push((humObj.sum[i] / humObj.values[i].length).toFixed(2));
                    }
                    i++;
                    tempObj.values.push([]);
                    humObj.values.push([]);
                    $scope.labels.push(moment(entry.date).format("YYYY-MM-DD"));

                    tempObj.values[i].push(parseFloat(temp));
                    tempObj.sum.push(parseFloat(temp));

                    humObj.values[i].push(parseFloat(hum));
                    humObj.sum.push(parseFloat(hum));
                } else {
                    tempObj.values[i].push(parseFloat(temp));
                    tempObj.sum[i] += (parseFloat(temp));
                    humObj.values[i].push(parseFloat(hum));
                    humObj.sum[i] += (parseFloat(hum));
                }

            });
            tempObj.avgs.push((tempObj.sum[i] / tempObj.values[i].length).toFixed(2));
            humObj.avgs.push((humObj.sum[i] / humObj.values[i].length).toFixed(2));
            console.log(tempObj);
            console.log(humObj);

            $scope.data = [
                tempObj.avgs,
                humObj.avgs
              ];
            console.log($scope.labels);

        });
    };
    $scope.updateHistoryData();
    $rootScope.updateHistoryData = $scope.updateHistoryData;
    $rootScope.updateHistoryPromise = $interval($scope.updateHistoryData, 60000);

});