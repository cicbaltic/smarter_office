var app = angular.module('smarterOfficeApp', ["chart.js"]);

app.controller('tempAndHumCtrl', function ($scope, $http, $timeout) {
    $http.get("http://cicb-smarter-office.stage1.mybluemix.net/api/latestTemperaturesAndHumByZoneIds").then(function (response) {
        $scope.myData = response.data.rows;

        angular.forEach($scope.myData, function (entry) {
            var hum = entry.hum_v;
            var temp = entry.temp_v;
            entry.humChart = {
                data: [
                    hum, 100 - hum
                ],
                labels: ["Humidity", "Other"]
            }
            entry.tempChart = {
                data: [
                    entry.temp_v, 50 - temp
                ],
                labels: ["Temperature", "Other"]
            }
            entry.options = {
                showTooltips: false,
                percentageInnerCutout: 70,
                responsive: false
            };
            var date = new Date(entry.date);
            var day = moment(entry.date);
            entry.formatedDate = moment(entry.date).format("YYYY-MM-DD HH:mm");
        });

    });

});