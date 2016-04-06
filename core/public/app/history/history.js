angular.module('smarterOfficeApp.history', [])
    .controller('historyCtrl', function ($scope, $http, $interval, $rootScope) {
        'use strict';
        if ($rootScope.updatePromise) {
            $interval.cancel($rootScope.updatePromise);
        }
        $scope.updateHistoryData = function () {
            $http.get("http://cicb-smarter-office.stage1.mybluemix.net/api/temperaturesAndHum/30").then(function (response) {

                $scope.labels = [];
                $scope.series = ['Temperature', 'Humidity'];
                $scope.data = [
                    [],
                    []
                ];
                $scope.options = {
                    scaleFontColor: "#FFF",
                    scaleGridLineColor: "rgba(255,255,255,.3)",
                    scaleLineColor: "rgba(255,255,255,.3)"

                };
                console.log(response);
                var histData = response.data.rows,
                    i = -1,
                    tempObj = {
                        values: [],
                        sum: [],
                        avgs: []
                    },
                    humObj = {
                        values: [],
                        sum: [],
                        avgs: []
                    };
                histData.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                angular.forEach(histData, function (entry) {
                    var hum = entry.hum_v,
                        temp = entry.temp_v;
                    if ($scope.labels.indexOf(moment(entry.date).format("YYYY-MM-DD")) === -1) {
                        if (i >= 0) {
                            tempObj.avgs.push((tempObj.sum[i] / tempObj.values[i].length).toFixed(2));
                            humObj.avgs.push((humObj.sum[i] / humObj.values[i].length).toFixed(2));
                        }
                        console.log(moment(entry.date).format("YYYY-MM-DD"));
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