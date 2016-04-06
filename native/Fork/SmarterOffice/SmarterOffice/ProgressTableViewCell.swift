//
//  ProgessTableViewCell.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 29/03/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import KDCircularProgress

class ProgressTableViewCell: UITableViewCell {

    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var progress: KDCircularProgress!
    
    @IBOutlet weak var humidityProgress: KDCircularProgress!
    @IBOutlet weak var humidityLabel: UILabel!
    @IBOutlet weak var temperatureLabel: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
