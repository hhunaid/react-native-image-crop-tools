//
//  CropViewManager.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 31/12/2019.
//

#import "CropViewManager.h"
#import "RCTCropView.h"
#import <React/RCTUIManager.h>

@implementation CropViewManager

RCT_EXPORT_MODULE()

-(UIView *)view {
    return [[RCTCropView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(sourceUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(onImageSaved, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(keepAspectRatio, BOOL)
RCT_EXPORT_VIEW_PROPERTY(cropAspectRatio, CGSize)
RCT_EXPORT_VIEW_PROPERTY(iosDimensionSwapEnabled, BOOL)


RCT_EXPORT_METHOD(saveImage:(nonnull NSNumber*) reactTag
                  preserveTransparency:(BOOL) preserveTransparency
                  quality:(nonnull NSNumber *) quality) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RCTCropView *cropView = (RCTCropView *)viewRegistry[reactTag];
        UIImage *image = [cropView getCroppedImage];

        NSString *extension = @"jpg";
        if ([[image valueForKey:@"hasAlpha"] boolValue] && preserveTransparency) {
            extension = @"png";
        }

        NSArray *paths = [[NSFileManager defaultManager] URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask];
        NSURL *url = [[paths firstObject] URLByAppendingPathComponent:[NSString stringWithFormat:@"%@.%@", [[NSUUID UUID] UUIDString], extension]];

        if ([[image valueForKey:@"hasAlpha"] boolValue] && preserveTransparency) {
            [UIImagePNGRepresentation(image) writeToURL:url atomically:YES];
        }else {
            [UIImageJPEGRepresentation(image, [quality floatValue] / 100.0f) writeToURL:url atomically:YES];
        }

        CGSize imageSize = image.size;


        cropView.onImageSaved(@{
            @"uri": url.absoluteString,
            @"width": [NSNumber numberWithDouble:imageSize.width],
            @"height": [NSNumber numberWithDouble:imageSize.height]}
        );
    }];
}

RCT_EXPORT_METHOD(rotateImage:(nonnull NSNumber*) reactTag clockwise:(BOOL) clockwise) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        RCTCropView *cropView = (RCTCropView *)viewRegistry[reactTag];
        [cropView rotateImage:clockwise];
    }];
}

@end
