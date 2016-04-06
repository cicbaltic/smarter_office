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
    
    let tableCellIdentifier = "ProgressTableViewCell"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setGradienLayerToTheView(view)
        setFonts()
        overlay = addOverlay(view)
        
        self.tableView.dataSource = self
        self.tableView.delegate = self

        loadTempAndHumDataForZones()
        
        // Do any additional setup after loading the view, typically from a nib.
        updateOutsideInfo()
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
        
        setGradienLayerToTheView(overlay!)

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
    
    func setGradienLayerToTheView(view: UIView) {
        let layer : CAGradientLayer = CAGradientLayer()
        layer.frame.size = view.frame.size
        layer.frame.origin = CGPointMake(0.0,0.0)
        
//        let color1 = UIColor(red:76/255, green:161/255, blue:175/255, alpha:1).CGColor
//        let color0 = UIColor(red:196/255, green:224/255, blue:229/255, alpha:1).CGColor
        
//        let color0 = UIColor(red:229/255, green:229/255, blue:190/255, alpha:1).CGColor
//        let color1 = UIColor(red:0, green:57/255, blue:115/255, alpha:1).CGColor
        
        //darkskies
        let color0 = UIColor(red:75/255, green:121/255, blue:161/255, alpha:0.7).CGColor
        let color1 = UIColor(red:40/255, green:62/255, blue:81/255, alpha:0.7).CGColor
        
        
        layer.colors = [color0,color1]
        view.layer.insertSublayer(layer, atIndex: 0)
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
                    self.outsideHumidity.text = String(format: "Humidity: %.0f", humidity)
                    self.outsidePressure.text = String(format: "Pressure: %.0fmb", pressure)
                    self.outsideFeelsLike.text =  String(format: "Feels like: %.1f°C", OpenWeather.getFeelsLikeInCelcius(temperature, currentHum: humidity)) as String
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
        cell.temperatureLabel.text = String(format: "%.0f", arguments: [rowItem.temperature])
        cell.humidityLabel.text = String(format: "%.0f", arguments: [rowItem.humidity])
        cell.progress.angle = 60
        return cell
    }
}

