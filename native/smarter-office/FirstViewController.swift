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
    
    @IBOutlet weak var weatherIcon: UILabel!
    let idToIcon:[Int: String] = [
        200 : "\u{EB28}",
        201 : "\u{EB29}",
        202 : "\u{EB2A}",
        210 : "\u{EB32}",
        211 : "\u{EB33}",
        212 : "\u{EB34}",
        221 : "\u{EB3D}",
        230 : "\u{EB46}",
        231 : "\u{EB47}",
        232 : "\u{EB48}",
        300 : "\u{EB8C}",
        301 : "\u{EB8D}",
        302 : "\u{EB8E}",
        310 : "\u{EB96}",
        311 : "\u{EB97}",
        312 : "\u{EB98}",
        313 : "\u{EB99}",
        314 : "\u{EB9A}",
        321 : "\u{EBA1}",
        500 : "\u{EC54}",
        501 : "\u{EC55}",
        502 : "\u{EC56}",
        503 : "\u{EC57}",
        504 : "\u{EC58}",
        511 : "\u{EC5F}",
        520 : "\u{EC68}",
        521 : "\u{EC69}",
        522 : "\u{EC6A}",
        531 : "\u{EC73}",
        600 : "\u{ECB8}",
        601 : "\u{ECB9}",
        602 : "\u{ECBA}",
        611 : "\u{ECC3}",
        612 : "\u{ECC4}",
        615 : "\u{ECC7}",
        616 : "\u{ECC8}",
        620 : "\u{ECCC}",
        621 : "\u{ECCD}",
        622 : "\u{ECCE}",
        701 : "\u{ED1D}",
        711 : "\u{ED27}",
        721 : "\u{ED31}",
        731 : "\u{ED3B}",
        741 : "\u{ED45}",
        751 : "\u{ED4F}",
        761 : "\u{ED59}",
        762 : "\u{ED5A}",
        771 : "\u{ED63}",
        781 : "\u{ED6D}",
        800 : "\u{ED80}",
        951 : "\u{ED80}",
        801 : "\u{F168}",
        802 : "\u{ED82}",
        803 : "\u{ED83}",
        804 : "\u{ED84}",
        900 : "\u{EDE4}",
        901 : "\u{EDE5}",
        902 : "\u{EDE6}",
        903 : "\u{EDE7}",
        904 : "\u{EDE8}",
        905 : "\u{EDE9}",
        906 : "\u{EDEA}",
        950 : "\u{EE16}",
        952 : "\u{EE18}",
        953 : "\u{EE19}",
        954 : "\u{EE1A}",
        955 : "\u{EE1B}",
        956 : "\u{EE1C}",
        957 : "\u{EE1D}",
        958 : "\u{EE1E}",
        959 : "\u{EE1F}",
        960 : "\u{EE20}",
        961 : "\u{EE21}",
        962 : "\u{EE22}",
        ]
   
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
        ow.updateAndGetData { (temperature, humidity, weatherID, isSuccess) -> Void in
                dispatch_async(dispatch_get_main_queue(), {
                     if (isSuccess) {
                        self.outsideHumidity.text = "Humidity: \(humidity)%"
                        self.outsideTemp.text = NSString(format: "%.2f°C", temperature) as String
                        self.outsideFeels.text =  NSString(format: "Feels like: %.2f°C", OpenWeather.getFeelsLikeInCelcius(temperature, currentHum: humidity)) as String
                        if let weatherSymbol = self.idToIcon[weatherID!] {
                            self.weatherIcon.text = weatherSymbol
                        }
                        
                     } else {
                        self.outsideTemp.text = "No connection"
                    }
                })
        }
    }
    
    
}

