//
//  GradientHelper.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 07/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import Foundation
import UIKit

class UIHelper {

    class func setGradienLayerToTheView(view: UIView) {
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
}