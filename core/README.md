# Node.js Starter Overview

The Node.js Starter demonstrates a simple, reusable Node.js web application based on the Express framework.

## Run the app locally

1. [Install Node.js][]
2. Download and extract the starter code from the Bluemix UI
3. cd into the app directory
4. Run `npm install` to install the app's dependencies
5. Run `npm start` to start the app
6. Access the running app in a browser at http://localhost:6001

[Install Node.js]: https://nodejs.org/en/download/

## Cloudant design documents

* Run script to import / re-create cloudant design documents:
$> sudo node run initCloudant

## REST URIs

GET api/temperaturesAndHum/:step?
* step represent minimum interval between two entries in seconds
* Response 200 (text/json)
* Sample call
  api/temperaturesAndHum/15
* Sample respond object:
```javascript
{  
   "size":415,
   "rows":[  
      {  
         "timestamp":1456673115263,
         "date":"2016-02-28T15:25:15.263Z",
         "zone_id":"123",
         "temp_v":"26.00",
         "hum_v":"47.00",
         "id":"eca8dfb5c9f9d9754ee56818ebcb212d"
      }
   ]
}
```

GET api/temperaturesAndHumWithRange/:startsWith/:endsWith/:step?
* startWith and endsWith represent range (e.g. 2014-10-10, 2014-10-10T10:10)
* step represent minimum interval between two entries in seconds
* Response 200 (text/json)
* Sample call
  api/temperaturesAndHumWithRange/2014-10-10/2017-10-10T10:10/16
* Sample respond object:
```javascript
{  
   "size":415,
   "rows":[  
      {  
         "timestamp":1456673115263,
         "date":"2016-02-28T15:25:15.263Z",
         "zone_id":"123",
         "temp_v":"26.00",
         "hum_v":"47.00",
         "id":"eca8dfb5c9f9d9754ee56818ebcb212d"
      }
   ]
}
```

GET api/temperaturesAndHumWithZoneId/:zoneId
* zoneId represent zone (e.g. one zone "123",  multiple zones "123,1,3")
* Response 200 (text/json)
* Sample call
  api/temperaturesAndHumWithZoneId/123
* Sample respond object:


GET /api/temperaturesAndHumWithRangeAndZoneId/:startsWith/:endsWith/:zoneId/:step?
* startWith and endsWith represent range (e.g. 2014-10-10, 2014-10-10T10:10)
* zoneId represent zone (e.g. one zone "123",  multiple zones "123,1,3")
* step represent minimum interval between two entries in seconds
* Response 200 (text/json)
* Sample call
  api/temperaturesAndHumWithRangeAndZoneId/2014-10-10/2017-10-10T10:10/123
* Sample respond object:
```javascript
{  
   "size":415,
   "rows":[  
      {  
         "timestamp":1456673115263,
         "date":"2016-02-28T15:25:15.263Z",
         "zone_id":"123",
         "temp_v":"26.00",
         "hum_v":"47.00",
         "id":"eca8dfb5c9f9d9754ee56818ebcb212d"
      }
   ]
}
```

