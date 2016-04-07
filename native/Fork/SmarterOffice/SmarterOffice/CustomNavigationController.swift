//
//  CustomNavigationController.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 07/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit

class CustomNavigationController: UINavigationController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.whiteColor()
        UIHelper.setGradienLayerToTheView(view)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
