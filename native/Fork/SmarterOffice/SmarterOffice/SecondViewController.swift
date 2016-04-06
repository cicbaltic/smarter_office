//
//  SecondViewController.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 29/03/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import Charts
import SwiftyJSON

class SecondViewController: UIViewController {

    @IBOutlet weak var segmentedControl: UISegmentedControl!
    @IBOutlet weak var temperatureChart: LineChartView!
    @IBOutlet weak var humidityChart: LineChartView!
    @IBOutlet weak var textField: UITextField!
    var pickerView : UIPickerView!
    var zoneId : Int!
    var items : [TempAndHum] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadDayData()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    @IBAction func segmentChanged(sender: AnyObject, forEvent event: UIEvent) {
        self.items.removeAll()
        switch segmentedControl.selectedSegmentIndex {
        case 0:
            loadDayData()
        case 1:
            loadWeekData()
        case 2:
            loadMonthData()
        case 3:
            loadYearData()
        default:
            print("Impossible!!!")
        }
    }
    
    func loadDayData() {
        RestApiManager.sharedInstance.getTemperatureAndHumidity{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(TempAndHum(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                    for tempAndHum in self.items {
                        print(tempAndHum.temperature, tempAndHum.humidity)
                    }
                    self.updateChart(nil)
                })
            }
        }
    }
    
    func loadWeekData() {
        RestApiManager.sharedInstance.getTemperatureAndHumidity{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(TempAndHum(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                    for tempAndHum in self.items {
                        print(tempAndHum.temperature, tempAndHum.humidity)
                    }
                    self.updateChart(NSDate().addDays(-7))
                })
            }
        }
    }
    
    func loadMonthData() {

        RestApiManager.sharedInstance.getTemperatureAndHumidity{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(TempAndHum(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                    for tempAndHum in self.items {
                        print(tempAndHum.temperature, tempAndHum.humidity)
                    }
                    self.updateChart(NSDate().addDays(-30))
                })
            }
        }
    }
    
    func loadYearData() {
        RestApiManager.sharedInstance.getTemperatureAndHumidity{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(TempAndHum(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                    for tempAndHum in self.items {
                        print(tempAndHum.temperature, tempAndHum.humidity)
                    }
                    self.updateChart(NSDate().addDays(-12*30))
                })
            }
        }
    }
    
    
    func updateChart(dateGreaterThan : NSDate?) {
        var filteredItems : [TempAndHum] = []
        var labels : [String] = []
        var tempValues : [Double] = []
        var humValues : [Double] = []
        
        for tempAndHum in self.items {
            
            if(dateGreaterThan != nil) {
                if(tempAndHum.zoneId == self.zoneId && tempAndHum.date.isGreaterThanDate(dateGreaterThan!, unit: .Day)) {
                    filteredItems.append(tempAndHum)
                }
            }
            
            if(tempAndHum.zoneId == self.zoneId && tempAndHum.date.equalToDate(NSDate(), unit: .Day)) {
                filteredItems.append(tempAndHum)
            }
            
        }
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.timeStyle = .ShortStyle
        
        for tempAndHum in filteredItems {
            labels.append(dateFormatter.stringFromDate(tempAndHum.date))
            tempValues.append(tempAndHum.temperature)
            humValues.append(tempAndHum.humidity)
        }
        
        setChartData(self.temperatureChart, labels: labels, values: tempValues)
        setChartData(self.humidityChart, labels: labels, values: humValues)
    }
    
    func setChartData(chart: LineChartView, labels : [String], values: [Double]) {
        // 1 - creating an array of data entries
        var yVals1 : [ChartDataEntry] = [ChartDataEntry]()
        for i in 0 ..< labels.count {
            yVals1.append(ChartDataEntry(value: values[i], xIndex: i))
        }
        
        // 2 - create a data set with our array
        let set1: LineChartDataSet = LineChartDataSet(yVals: yVals1, label: "First Set")
        set1.axisDependency = .Left // Line will correlate with left axis values
        set1.setColor(UIColor.redColor().colorWithAlphaComponent(0.2)) // our line's opacity is 50%
        set1.setCircleColor(UIColor.redColor()) // our circle will be dark red
        set1.lineWidth = 2.0
        set1.fillAlpha = 65 / 255.0
        set1.fillColor = UIColor.redColor()
        set1.highlightColor = UIColor.whiteColor()
        set1.drawCirclesEnabled = false
        
        //3 - create an array to store our LineChartDataSets
        var dataSets : [LineChartDataSet] = [LineChartDataSet]()
        dataSets.append(set1)
        
        //4 - pass our months in for our x-axis label value along with our dataSets
        let data: LineChartData = LineChartData(xVals: labels, dataSets: dataSets)
        data.setValueTextColor(UIColor.blackColor())
        
        //5 - finally set our data
        chart.backgroundColor = UIColor.whiteColor()
        chart.getAxis(.Left).drawGridLinesEnabled = false
        chart.rightAxis.drawLabelsEnabled = false
        chart.xAxis.drawGridLinesEnabled = false
        chart.legend.enabled = false
        chart.descriptionText = ""
        chart.data = data
        chart.xAxis.labelPosition = .Bottom
        
    }
}

