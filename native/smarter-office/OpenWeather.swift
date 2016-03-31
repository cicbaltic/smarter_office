//
//  OpenWeather.swift
//  smarter-office
//
//  Created by  ibm-mac-pool-01 on 10/03/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation
import UIKit

class OpenWeather {
    
    private let APIKEY = "5420771b338f8d96800692777aa227bf"
    var lat:Double
    var lon:Double
    var temperature:Double?
    var humidity:Double?
    var temperatureInCelsius:Double? {
        get {
            if (temperature != nil) {
                return temperature! - 273.15
            } else {
                return nil
            }
        }
    }
    var URL:String {
        get{
            return "http://api.openweathermap.org/data/2.5/weather?lat=\(self.lat)&lon=\(self.lon)&appid=\(self.APIKEY)"
        }
    }
    
    var weatherID:Int?
        
    var weatherPic:UIImage?
    
    init(lat:Double, lon:Double){
        self.lat = lat
        self.lon = lon
    }
    
    convenience init() {
        //Assume IBM Lietuva coords
        self.init(lat: 54.694436,lon: 25.282658)
    }
    
    func updateAndGetData(callback: (temperature:Double, humidity:Double, weatherID:Int?, isSuccess:Bool) -> Void) {
        let request = NSMutableURLRequest(URL: NSURL(string: self.URL)!)
        httpGet(request){
            (data, error) -> Void in
            if error != nil {
                print("Error in connection: \(error)")
                return callback(temperature: 0, humidity: 0, weatherID: self.weatherID, isSuccess: false)
            } else {
                let jsonRes = data.dataUsingEncoding(NSUTF8StringEncoding)
                self.parseJSON(jsonRes!)
                guard let temperature = self.temperatureInCelsius,
                    let humidity = self.humidity
                    else{return                }
                callback(temperature: temperature, humidity: humidity, weatherID: self.weatherID, isSuccess: true)
            }
        }
    }
    
    static func getFeelsLikeInCelcius(currentTempCelsius:Double, currentHum:Double) -> Double {
        
        let h = currentHum
        let t  = (9 * currentTempCelsius / 5 + 32)
        var heatIndex = 0.5 * (t + 61 + (t - 68) * 1.2 + h * 0.094);
        
        if (t >= 80) {
            let heatIndexBase = (-42.379                      +
                2.04901523 * t +
                10.14333127 * h +
                -0.22475541 * t * h +
                -0.00683783 * t * t +
                -0.05481717 * h * h +
                0.00122874 * t * t * h +
                0.00085282 * t * h * h +
                -0.00000199 * t * t * h * h);
            if (h < 13 && t <= 112) {
                heatIndex = heatIndexBase - (13 - h) / 4 * sqrt((17 - abs(t - 95)) / 17);
            } else if (h > 85 && t <= 87) {
                heatIndex = heatIndexBase + ((h - 85) / 10) * ((87 - t) / 5)
            } else {
                heatIndex = heatIndexBase;
            }
        }
        
        return (5 * (heatIndex - 32) / 9)
        
    }
    
    private func parseJSON(json:NSData) {
        do {
            let json = try NSJSONSerialization.JSONObjectWithData(json, options: .AllowFragments)
            
            if let main = json["main"] as? [String: AnyObject] {
                
                guard let temperature = main["temp"] as? Double,
                    let humidity = main["humidity"] as? Double
                    else {return}
                self.temperature = temperature
                self.humidity = humidity
            }
            if let weather = json["weather"] as? [[String: AnyObject]] {
                if let picName = weather[0]["id"] as? Int {
                    self.weatherID = picName
                    print(picName)
                }
            }
        } catch {
            print("error serializing JSON: \(error)")
        }
    }
    
    
    private func httpGet(request: NSURLRequest!, callback: (String, String?) -> Void) {
        let session = NSURLSession.sharedSession()
        let task = session.dataTaskWithRequest(request){
            (data, response, error) -> Void in
            if error != nil {
                callback("", error!.localizedDescription)
            } else {
                let result = NSString(data: data!, encoding:
                    NSASCIIStringEncoding)!
                callback(result as String, nil)
            }
        }
        task.resume()
    }
    
}