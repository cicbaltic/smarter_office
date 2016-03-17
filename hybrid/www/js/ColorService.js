(function() {
  'use strict';
  angular
        .module('starter')
        .factory('colorService', [
            function () {
              var colorService = {};

              colorService.tempColor = function (temp) {
                return colorService.colorPicker(temp - 16);
              };

              colorService.humColor = function (hum) {
                return colorService.colorPicker(Math.round(hum / 10));
              };

              colorService.colorPicker = function (grade) {
                if (grade < 1) {
                  return '#4C00E5';
                } else if (grade > 9) {
                  return '#EB6060';
                } else {
                  switch (grade) {
                    case 1: return '#091EE5';
                    case 2: return '#1283E6';
                    case 3: return '#1CDFE6';
                    case 4: return '#25E79A';
                    case 5: return '#2FE84E';
                    case 6: return '#67E839';
                    case 7: return '#B7E942';
                    case 8: return '#E9D44C';
                    case 9: return '#EA9656';
                    default: return '#808080';                      
                  }
                }
              };

              return colorService;
            }]);
})();
