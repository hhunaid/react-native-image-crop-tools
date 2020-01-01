//
//  CropViewManager.swift
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 31/12/2019.
//

import Foundation

@objc(CropViewManager)
class CropViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        return CropView()
    }
    
    @objc(getCroppedImage:)
    func getCroppedImage(_ reactTag: NSNumber) {
        self.bridge!.uiManager.addUIBlock { (uiManager, viewRegistry) in
            if let cropView = viewRegistry?[reactTag] as? CropView {
                cropView.fireEvent()
            }
        }
    }
}
