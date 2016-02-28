# Node application for RPi

## Prerequisites:

* Bluemix: ready IOT application
* Bluemix: registered RPi in IOT application, created API token
* RPi: Node and NPM
* RPi: bcm2835 - C library, used for thermal and humidity sensors like DHT11 and DHT22

bcm2835: Node module "node-dht-sensor" requires library "bcm2835" to be preinstalled in RPi.
Install instructions are in http://www.airspayce.com/mikem/bcm2835/

## Installation

* Upload node application into RPi:

+-- _nodeserver
    +-- iot-config-example.json
    +-- monitor.js
    +-- package.json
    +-- README.md
+-- iotApp.json

* Copy the iot-config-example.json into parent directory with file name iotApp.json
* Fill iotApp.json with correct values from Bluemix IOT application
* Install Node dependencies:
$> cd ./nodeserver
$> npm install

* Run script to collect sensor data and push to iot:
$> sudo node monitor.js

On successful run you should see:

Initialized sensor
ApplicationClient Connected
Temperature: 27.00C, humidity: 46.00%
Publish: iot-2/type/RPi/id/RPi_test/evt/environment/fmt/json, {"environment":{"temp":{"v":"27.00","u":"C"},"hum":{"v":"46.00","u":"%"}},"zone":{"id":"123","name":"testPi"}}
