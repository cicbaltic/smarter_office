//
//  FirstViewController.swift
//  smarter-office
//
//  Created by Marius Vezelis on 19/02/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import Charts

import KDCircularProgress

class FirstViewController: UIViewController {
    @IBOutlet weak var temp: UILabel!
    @IBOutlet var lineChartView: LineChartView!
    @IBOutlet weak var outsideHumidity: UILabel!
    @IBOutlet weak var outsideTemp: UILabel!
    @IBOutlet weak var outsideFeels: UILabel!
    @IBOutlet weak var outsideImage: UIImageView!
    @IBOutlet weak var humitidyProgress: KDCircularProgress!
    @IBOutlet weak var tempProgress: KDCircularProgress!
    @IBOutlet weak var humidity: UILabel!
    
   
    override func viewDidLoad() {
        super.viewDidLoad()
        
        updateOutsideInfo()
        updateHumidity(87)
        updateTemp(22)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateHumidity(humidity:Double) {
        let newAngle = Int(360 * (humidity / 100))
        self.humidity.text = NSString(format: "%.0f %%", humidity) as String
        self.humitidyProgress.animateToAngle(newAngle, duration: 2) { (_) -> Void in }
        
    }
    
    func updateTemp(temp:Double) {
        //Assume 0min 40max
        var newAngle:Int
        if(temp > 40) {
            newAngle = 360
        } else if(temp < 0) {
            newAngle = 0
        } else {
            newAngle = Int(360 * (temp / 40))
        }
        self.temp.text = NSString(format: "%.0f °C", temp) as String
        self.tempProgress.animateToAngle(newAngle, duration: 2) { (_) -> Void in }
        
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
    
    
}

