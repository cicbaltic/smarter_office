//
//  DateExtension.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 04/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation

extension NSDate {
    func isGreaterThanDate(dateToCompare: NSDate, unit: NSCalendarUnit) -> Bool {
        return NSCalendar.currentCalendar().compareDate(self, toDate: dateToCompare, toUnitGranularity: unit) == NSComparisonResult.OrderedDescending
    }
    
    func isLessThanDate(dateToCompare: NSDate, unit: NSCalendarUnit) -> Bool {
        return NSCalendar.currentCalendar().compareDate(self, toDate: dateToCompare, toUnitGranularity: unit) == NSComparisonResult.OrderedAscending
    }
    
    func equalToDate(dateToCompare: NSDate, unit: NSCalendarUnit) -> Bool {
        return NSCalendar.currentCalendar().compareDate(self, toDate: dateToCompare, toUnitGranularity: unit) == NSComparisonResult.OrderedSame
    }
    
    func addDays(daysToAdd: Int) -> NSDate {
        let secondsInDays: NSTimeInterval = Double(daysToAdd) * 60 * 60 * 24
        let dateWithDaysAdded: NSDate = self.dateByAddingTimeInterval(secondsInDays)
        
        //Return Result
        return dateWithDaysAdded
    }
    
    func addHours(hoursToAdd: Int) -> NSDate {
        let secondsInHours: NSTimeInterval = Double(hoursToAdd) * 60 * 60
        let dateWithHoursAdded: NSDate = self.dateByAddingTimeInterval(secondsInHours)
        
        //Return Result
        return dateWithHoursAdded
    }
}