//
//  FirstViewController.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 29/03/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import SwiftyJSON
import KDCircularProgress

class FirstViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var items : [TempAndHum] = []
    
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var officeNameLabel: UILabel!
    @IBOutlet weak var lastUpdatedLabel: UILabel!
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var outsideImage: UILabel!
    @IBOutlet weak var outsideTemp: UILabel!
    @IBOutlet weak var outsidePressure: UILabel!
    @IBOutlet weak var outsideHumidity: UILabel!
    @IBOutlet weak var outsideFeelsLike: UILabel!
    
    @IBOutlet weak var currentWeatherView: UIStackView!
    @IBOutlet weak var localWeatherView: UITableView!
    
    var overlay : UIView?
    var outsideTempLoaded : Bool = false
    var insideTempLoaded : Bool = false
    var timer = NSTimer()
    
    let tableCellIdentifier = "ProgressTableViewCell"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIHelper.setGradienLayerToTheView(view)
        setFonts()
        overlay = addOverlay(view)
        
        self.tableView.dataSource = self
        self.tableView.delegate = self

        loadTempAndHumDataForZones()
        
        // Do any additional setup after loading the view, typically from a nib.
        updateOutsideInfo()
        self.timer.invalidate()
        self.timer = NSTimer.scheduledTimerWithTimeInterval(60, target: self, selector: #selector(FirstViewController.updateData), userInfo: nil, repeats: true)
        updateLastUpdateLabel() 
    }
    
    func updateData() {
        self.items.removeAll()
        loadTempAndHumDataForZones()
        updateOutsideInfo()
    }
    
    func updateLastUpdateLabel() {
        let date = NSDate()
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "HH:mm"
        self.lastUpdatedLabel.text = "Updated at " + dateFormatter.stringFromDate(date)
    }
    
    @IBAction func refreshBtn() {
        overlay = addOverlay(view)
        self.updateData()
    }
    
    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return .Portrait
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    /**
     Adds loading overlay to the view provided
     */
    func addOverlay(view: UIView) -> UIView {
        var overlay : UIView? // This should be a class variable
        
        overlay = UIView(frame: view.frame)
        overlay!.backgroundColor = UIColor.whiteColor()
        overlay!.alpha = 1
        
        view.addSubview(overlay!)
        
        let myActivityIndicator = UIActivityIndicatorView(activityIndicatorStyle: UIActivityIndicatorViewStyle.WhiteLarge)
        myActivityIndicator.center = view.center
        myActivityIndicator.startAnimating()
        overlay!.addSubview(myActivityIndicator)
        
        UIHelper.setGradienLayerToTheView(overlay!)

        return overlay!;
    }
    
    func removeOverlay() {
        overlay?.removeFromSuperview()
    }
    
    func removeOverlayIfNeeded() {
        if(outsideTempLoaded && insideTempLoaded) {
            removeOverlay()
            outsideTempLoaded = false;
            insideTempLoaded = false;
        }
    }
    
    func setFonts() {
        locationLabel.font = UIFont(name: "FontAwesome", size: 14)
        officeNameLabel.font = UIFont(name: "FontAwesome", size: 14)
    }
    
    func updateOutsideInfo() {
        let ow = OpenWeather();
        ow.updateAndGetData { (temperature, humidity, pressure, weatherIcon, isSuccess) -> Void in
            dispatch_async(dispatch_get_main_queue(), {
                if (isSuccess) {
                    self.outsideTempLoaded = true;
                    self.removeOverlayIfNeeded();
                    
                    let iconText : String = weatherIcon!.iconText;
                    self.outsideImage.text = iconText
                    
                    self.outsideTemp.text = String(format: "%.0f \u{f03c}", arguments: [temperature])
                    self.outsideHumidity.text = String(format: "Humidity: %.0f%%", humidity)
                    self.outsidePressure.text = String(format: "Pressure: %.0fmb", pressure)
                    self.outsideFeelsLike.text =  String(format: "Feels like: %.1f°C", OpenWeather.getFeelsLikeInCelcius(temperature, currentHum: humidity)) as String
                    self.updateLastUpdateLabel()
                } else {
//                    self.outsideTemp.text = "No connection"
                }
            })
        }
    }
    
    func loadTempAndHumDataForZones() {
        RestApiManager.sharedInstance.getLatestTemperatureAndHumidityForZones{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(TempAndHum(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                    self.insideTempLoaded = true;
                    self.removeOverlayIfNeeded();
                    
                    self.tableView.reloadData()
                })
            }
        }
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print(self.items.count)
        
        return self.items.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = self.tableView.dequeueReusableCellWithIdentifier(tableCellIdentifier, forIndexPath: indexPath) as! ProgressTableViewCell
        
        cell.contentView.backgroundColor = UIColor.clearColor()
        cell.backgroundColor = UIColor.clearColor()
        tableView.backgroundColor = UIColor.clearColor()
        
        let rowItem : TempAndHum = self.items[indexPath.row]
        
        cell.locationLabel?.text = String(rowItem.zoneId)
        cell.temperatureLabel.text = String(format: "%.1f°", arguments: [rowItem.temperature])
        cell.humidityLabel.text = String(format: "%.0f%%", arguments: [rowItem.humidity])
        cell.progress.animateToAngle(getTempAngle(rowItem.temperature), duration: 2) { (_) in }
        cell.humidityProgress.animateToAngle(getHumidityAngle(rowItem.humidity), duration: 2) { (_) in }
        return cell
    }
    
    func getTempAngle(temperature:Double) -> Double {
        let max = 40.0
        let min = 0.0
        if(temperature > max) {
            return 360
        } else if(temperature < min) {
            return 0
        } else {
            return 360 * (temperature / max)
        }
    }
    
    func getHumidityAngle(humidity:Double) -> Double {
        return 360 * (humidity / 100)
    }
}

