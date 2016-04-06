//
//  ZoneData.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 03/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation
import SwiftyJSON

class Zone {
    var zoneId : Int!
    var zoneName: String!
    
    required init(json: JSON) {
        zoneId = Int(json["key"].array![0].stringValue)
        zoneName = json["value"]["zone_name"].stringValue
    }
}