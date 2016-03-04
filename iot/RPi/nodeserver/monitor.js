var sensorLib = require('node-dht-sensor');
var Client = require("ibmiotf").IotfApplication;


var config = require("../iotApp.json");
var deviceClient = new Client(config);

var sensor = {
    initialize: function () {
        return sensorLib.initialize(11, 4);
    },
    read: function () {
        var readout = sensorLib.read();

        var temperature = readout.temperature.toFixed(2);
        var humidity = readout.humidity.toFixed(2);
        console.log('Temperature: ' + temperature + 'C, ' +
            'humidity: ' + humidity + '%');

        var data = {
            environment: {
                temp:{
                    v:temperature,
                    u:"C"
                },
                hum:{
                    v:humidity,
                    u:"%"
                }
            },
            zone:{
                id:"123",
                name:"testPi"
            }
        };

        var json = JSON.stringify(data);

        deviceClient.publishDeviceEvent("RPi", "RPi_test", "environment", "json", json);

        if(deviceClient.isConnected){

            setTimeout(function () {
                sensor.read();
            }, 10000);
        }else{
            console.log('Will retry...');

            setTimeout(function () {
                deviceClient.connect();
            }, 1000);
        }

    }
};

if (sensor.initialize()) {
    console.warn('Initialized sensor');
} else {
    console.warn('Failed to initialize sensor');
    process.exit(1);
}

deviceClient.connect();

deviceClient.on('connect', function () {
    sensor.read();
});

deviceClient.log.setLevel('trace');
deviceClient.on('error', function (argument) {
    console.log(argument);
    process.exit(1);
});