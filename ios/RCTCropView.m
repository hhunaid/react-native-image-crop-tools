//
//  RCTCropView.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 06/01/2020.
//

#import "RCTCropView.h"
#import <TOCropViewController/TOCropView.h>
#import <TOCropViewController/UIImage+CropRotate.h>
#import <Photos/Photos.h>

@implementation RCTCropView {
    TOCropView * _inlineCropView, *url;
}

@synthesize sourceUrl, keepAspectRatio, cropAspectRatio;

- (void)layoutSubviews {
    if (_inlineCropView == nil) {
    url =[sourceUrl stringByReplacingOccurrencesOfString:@"ph://" withString:@""];
    self.requestOptions = [[PHImageRequestOptions alloc] init];
    self.requestOptions.resizeMode   = PHImageRequestOptionsResizeModeExact;
    self.requestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
    self.requestOptions.synchronous = YES;

    PHAsset *photosAsset = [PHAsset fetchAssetsWithLocalIdentifiers:@[url] options: nil].lastObject;
    if([sourceUrl rangeOfString:@"ph://"].location == 0) {
     PHImageManager *manager = [PHImageManager defaultManager];
      __block UIImage *ima;
        [manager requestImageForAsset:photosAsset
            targetSize:PHImageManagerMaximumSize
            contentMode:PHImageContentModeDefault
            options:self.requestOptions
            resultHandler:^void(UIImage *image, NSDictionary *info) {
            ima = image;
         }];
    _inlineCropView = [[TOCropView alloc] initWithImage:ima];
    } else { 
        UIImage * image =[UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:sourceUrl]]];
        _inlineCropView = [[TOCropView alloc] initWithImage:image];
    } 
        _inlineCropView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _inlineCropView.frame = self.bounds;
        if (self->keepAspectRatio) {
            _inlineCropView.aspectRatioLockEnabled = keepAspectRatio;
        }
        if (!CGSizeEqualToSize(self -> cropAspectRatio, CGSizeZero)) {
            _inlineCropView.aspectRatio = self->cropAspectRatio;
        }
        [_inlineCropView moveCroppedContentToCenterAnimated:NO];
        [_inlineCropView performInitialSetup];
        
        [self addSubview:_inlineCropView];
    }
}

- (UIImage *)getCroppedImage {
    return [_inlineCropView.image croppedImageWithFrame:_inlineCropView.imageCropFrame angle:_inlineCropView.angle circularClip:NO];
}

- (void)setCropAspectRatio:(CGSize)aspectRatio {
    if (_inlineCropView) {
        _inlineCropView.aspectRatio = aspectRatio;
    }
    self->cropAspectRatio = aspectRatio;
}

-(CGSize)cropAspectRatio {
    return _inlineCropView.aspectRatio;
}

- (void)setKeepAspectRatio:(BOOL)keepAspectRatio {
    if (_inlineCropView) {
        _inlineCropView.aspectRatioLockEnabled = keepAspectRatio;
    }
    self->keepAspectRatio = keepAspectRatio;
}

- (BOOL)keepAspectRatio {
    return _inlineCropView.aspectRatioLockEnabled;
}

- (void)rotateImage:(BOOL)clockwise {
    [_inlineCropView rotateImageNinetyDegreesAnimated:YES clockwise:clockwise];
}

@end
