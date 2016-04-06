//
//  RestManager.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 03/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation
import SwiftyJSON

typealias ServiceResponse = (JSON, NSError?) -> Void

class RestApiManager: NSObject {
    static let sharedInstance = RestApiManager()
    
    let baseURL = "http://cicb-smarter-office.stage1.mybluemix.net/api"
    
    func getZones(onCompletion: (JSON) -> Void) {
        let route = baseURL + "/zones"
        makeHTTPGetRequest(route, onCompletion: {json, err in onCompletion(json as JSON)})
    }
    
    func getTemperatureAndHumidity(onCompletion: (JSON) -> Void) {
        let route = baseURL + "/temperaturesAndHum"
        makeHTTPGetRequest(route, onCompletion: {json,
            err in onCompletion(json as JSON)
        })
    }
    
    func getLatestTemperatureAndHumidityForZones(onCompletion: (JSON) -> Void) {
        let route = baseURL + "/latestTemperaturesAndHumByZoneIds"
        makeHTTPGetRequest(route, onCompletion: {json,
            err in onCompletion(json as JSON)
        })
    }
    
    private func makeHTTPGetRequest(path: String, onCompletion: ServiceResponse) {
        let request = NSMutableURLRequest(URL: NSURL(string: path)!)
        
        let session = NSURLSession.sharedSession()
        
        let task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
            if let jsonData = data {
                let json:JSON = JSON(data: jsonData)
                onCompletion(json, error)
            } else {
                onCompletion(nil, error)
            }
        })
        task.resume()
    }
}