//
//  CropViewManager.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 31/12/2019.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(CropViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(sourceUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(onImageCropPress, RCTBubblingEventBlock)
RCT_EXTERN_METHOD(getCroppedImage:(nonnull NSNumber *))

@end
