//
//  CropViewManager.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 31/12/2019.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(CropViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(sourceUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(onImageSaved, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(keepAspectRatio, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cropAspectRatio, CGFloat)

RCT_EXTERN_METHOD(saveImage:(nonnull NSNumber *))

@end
