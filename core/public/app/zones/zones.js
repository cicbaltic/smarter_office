angular.module('smarterOfficeApp.zones', ['angular-loading-bar'])
    .controller('tempAndHumCtrl', function ($scope, $http, $interval, $rootScope) {
        'use strict';
        if ($rootScope.updateHistoryPromise) {
            $interval.cancel($rootScope.updateHistoryPromise);
        }
        var HKKUrl = "http://www.hkk.gf.vu.lt/json.php?callback=JSON_CALLBACK";
        window.wup = function (data) {
            console.log(data);
            $scope.outsideDataTemp = data.zeno_AT_5s_C;
            $scope.outsideDataHum = data.zeno_RH_5s;
        }

        $scope.updateData = function () {
            $http.get("http://cicb-smarter-office.stage1.mybluemix.net/api/latestTemperaturesAndHumByZoneIds").then(function (response) {
                $scope.myData = response.data.rows;


                $http.jsonp(HKKUrl);


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
                        animateScale: true,
                        segmentShowStroke: false
                    };
                    if (hum < 40 || hum > 60) {
                        entry.humChart.colors = ['#e71d32', '#e0e0e0'];
                        console.log('bad hum');
                        if (hum < 40) {
                            entry.humChart.message = 'Too dry!';
                        } else if (hum > 60) {
                            entry.humChart.message = 'Too humid!';
                        }
                    } else {
                        entry.humChart.colors = ['#4b8400', '#e0e0e0'];
                        entry.humChart.message = 'OK';
                    }



                    if (temp < 22) {
                        entry.tempChart.colors = ['#5aaafa', '#e0e0e0'];
                        entry.tempChart.message = 'Too cold!';
                    } else if (temp > 24) {
                        entry.tempChart.colors = ['#e71d32', '#e0e0e0'];
                        entry.tempChart.message = 'Too hot!';

                    } else {
                        entry.tempChart.colors = ['#4b8400', '#e0e0e0'];
                        entry.tempChart.message = 'OK';
                    }

                    entry.formatedDate = moment(entry.date).format("YYYY-MM-DD HH:mm");
                    console.log(entry.formatedDate);
                });

            });
        };
        //console.log($rootScope);
        $scope.updateData();
        $rootScope.updateData = $scope.updateData;
        $rootScope.updatePromise = $interval($scope.updateData, 30000);

    });