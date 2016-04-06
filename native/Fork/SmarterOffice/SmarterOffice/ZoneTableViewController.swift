//
//  ZoneTableViewController.swift
//  SmarterOffice
//
//  Created by Marius Vezelis on 03/04/16.
//  Copyright © 2016 IBM. All rights reserved.
//

import UIKit
import SwiftyJSON

class ZoneTableViewController: UITableViewController {
    var items = [Zone]()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()

        RestApiManager.sharedInstance.getZones{ (json : JSON) in
            if let results = json["rows"].array {
                for entry in results {
                    self.items.append(Zone(json: entry))
                }
                dispatch_async(dispatch_get_main_queue(),{
                        self.tableView.reloadData()                    
                    for zone in self.items {
                        print("%d - %s", zone.zoneId, zone.zoneName)
                    }
                    
                })
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print("count", self.items.count)
        return self.items.count
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> ZoneTableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("ZoneTableViewCell", forIndexPath: indexPath) as! ZoneTableViewCell

        // Configure the cell...

        cell.label.text = self.items[indexPath.row].zoneName
        print(self.items[indexPath.row].zoneName)
        return cell
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {

        let secondViewController = segue.destinationViewController as! SecondViewController
        if let zoneTableViewCell = sender as? ZoneTableViewCell {
            secondViewController.zoneId = self.items[tableView.indexPathForCell(zoneTableViewCell)!.row].zoneId            
        }
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }

}
