//
//  FirstViewController.swift
//  smarter-office
//
//  Created by Marius Vezelis on 19/02/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import Charts
import Starscream

class FirstViewController: UIViewController, WebSocketDelegate {
    @IBOutlet weak var temp: UILabel!
    @IBOutlet var lineChartView: LineChartView!
    @IBOutlet weak var outsideHumidity: UILabel!
    @IBOutlet weak var outsideTemp: UILabel!
    @IBOutlet weak var outsideFeels: UILabel!
    @IBOutlet weak var outsideImage: UIImageView!
    var socket = WebSocket(url: NSURL(string: "ws://localhost:8001/")!)

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let unitsSold = [18.0, 18.5, 18.0, 19.0, 18.5, 20.0, 19.5, 18.5, 19.0, 18.0, 18.5, 18.0]

        //self.setChart(months, values: unitsSold)
        self.setChartData(months, unitsSold: unitsSold)
        socket.delegate = self
        socket.connect()
        updateOutsideInfo()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateOutsideInfo() {
        let ow = OpenWeather();
        ow.updateAndGetData { (temperature, humidity, image, isSuccess) -> Void in
                dispatch_async(dispatch_get_main_queue(), {
                     if (isSuccess) {
                        self.outsideHumidity.text = "Humidity: \(humidity)%"
                        self.outsideTemp.text = NSString(format: "%.2f°C", temperature) as String
                        self.outsideFeels.text =  NSString(format: "Feels like: %.2f°C", OpenWeather.getFeelsLikeInCelcius(temperature, currentHum: humidity)) as String
                        if let weatherImage = image {
                            self.outsideImage.image = weatherImage
                        }
                     } else {
                        self.outsideTemp.text = "No connection"
                    }
                })
        }
    }
    
    func setChart(dataPoints: [String], values: [Double]) {
        lineChartView.noDataText = "No data for the chart."
        
        var dataEntries: [BarChartDataEntry] = []
        
        for i in 0..<dataPoints.count {
            let dataEntry = BarChartDataEntry(value: values[i], xIndex: i)
            dataEntries.append(dataEntry)
        }
        
        let chartDataSet = BarChartDataSet(yVals: dataEntries, label: "Units Sold")
        let chartData = BarChartData(xVals: dataPoints, dataSet: chartDataSet)
        lineChartView.data = chartData
    }
    
    func setChartData(months : [String], unitsSold: [Double]) {
        // 1 - creating an array of data entries
        var yVals1 : [ChartDataEntry] = [ChartDataEntry]()
        for var i = 0; i < months.count; i++ {
            yVals1.append(ChartDataEntry(value: unitsSold[i], xIndex: i))
        }
        
        // 2 - create a data set with our array
        let set1: LineChartDataSet = LineChartDataSet(yVals: yVals1, label: "First Set")
        set1.axisDependency = .Left // Line will correlate with left axis values
        set1.setColor(UIColor.redColor().colorWithAlphaComponent(0.2)) // our line's opacity is 50%
        set1.setCircleColor(UIColor.redColor()) // our circle will be dark red
        set1.lineWidth = 2.0
        set1.circleRadius = 6.0 // the radius of the node circle
        set1.fillAlpha = 65 / 255.0
        set1.fillColor = UIColor.redColor()
        set1.highlightColor = UIColor.whiteColor()
        set1.drawCircleHoleEnabled = true
        
        //3 - create an array to store our LineChartDataSets
        var dataSets : [LineChartDataSet] = [LineChartDataSet]()
        dataSets.append(set1)
        
        //4 - pass our months in for our x-axis label value along with our dataSets
        let data: LineChartData = LineChartData(xVals: months, dataSets: dataSets)
        data.setValueTextColor(UIColor.blackColor())
        
        //5 - finally set our data
        self.lineChartView.backgroundColor = UIColor.whiteColor()
        self.lineChartView.getAxis(.Left).drawGridLinesEnabled = false
        self.lineChartView.xAxis.drawGridLinesEnabled = false
        self.lineChartView.data = data
        self.lineChartView.xAxis.labelPosition = .Bottom
    
    }

    func websocketDidConnect(socket: WebSocket) {
        print("websocket is connected")
    }
    
    func websocketDidDisconnect(socket: WebSocket, error: NSError?) {
        print("websocket is disconnected: \(error?.localizedDescription)")
    }
    
    func websocketDidReceiveMessage(socket: WebSocket, text: String) {
        print("got some text: \(text)")
        print(self.temp)
        if(self.temp != nil) {
            self.temp.text = text + "° C";
        }
    }
    
    func websocketDidReceiveData(socket: WebSocket, data: NSData) {
        print("got some data: \(data.length)")
    }
    
}

