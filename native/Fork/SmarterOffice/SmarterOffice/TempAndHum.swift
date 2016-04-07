//
//  TempAndHum.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 03/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation
import SwiftyJSON

class TempAndHum {
    var id : String
    var date : NSDate!
    var temperature : Double!
    var humidity : Double!
    var zoneId : Int!
    
    required init(json: JSON) {
        id = json["id"].stringValue
        temperature = Double(json["temp_v"].stringValue)
        humidity = Double(json["hum_v"].stringValue)
        zoneId = Int(json["zone_id"].stringValue)
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        
        date = dateFormatter.dateFromString(json["date"].stringValue)
    }
}