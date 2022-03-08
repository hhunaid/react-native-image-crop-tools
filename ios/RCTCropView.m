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
    TOCropView * _inlineCropView;
}

@synthesize sourceUrl, keepAspectRatio, cropAspectRatio, iosDimensionSwapEnabled;

- (void)layoutSubviews {
    if (_inlineCropView == nil) {
        if([sourceUrl rangeOfString:@"ph://"].location == 0) {
            NSString *url = [sourceUrl stringByReplacingOccurrencesOfString:@"ph://" withString:@""];
            PHImageRequestOptions * requestOptions = [[PHImageRequestOptions alloc] init];
            requestOptions.resizeMode   = PHImageRequestOptionsResizeModeExact;
            requestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
            requestOptions.synchronous = YES;

            PHAsset *photosAsset = [PHAsset fetchAssetsWithLocalIdentifiers:@[url] options: nil].lastObject;
            PHImageManager *manager = [PHImageManager defaultManager];
            __block UIImage *blockImage;
            [manager requestImageForAsset:photosAsset
                               targetSize:PHImageManagerMaximumSize
                              contentMode:PHImageContentModeDefault
                                  options:requestOptions
                            resultHandler:^void(UIImage *image, NSDictionary *info) {
                blockImage = image;
            }];
            _inlineCropView = [[TOCropView alloc] initWithImage:blockImage];
        } else {
            UIImage * image =[UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:sourceUrl]]];
            _inlineCropView = [[TOCropView alloc] initWithImage:image];
        }
        _inlineCropView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _inlineCropView.frame = self.bounds;
        if (self->keepAspectRatio) {
            _inlineCropView.aspectRatioLockEnabled = keepAspectRatio;
        }
        if (self->iosDimensionSwapEnabled) {
            _inlineCropView.aspectRatioLockDimensionSwapEnabled = iosDimensionSwapEnabled;
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

- (void)setIosDimensionSwapEnabled:(BOOL)iosDimensionSwapEnabled {
    if (_inlineCropView) {
        _inlineCropView.aspectRatioLockDimensionSwapEnabled = iosDimensionSwapEnabled;
    }
    self->iosDimensionSwapEnabled = iosDimensionSwapEnabled;
}

- (BOOL)iosDimensionSwapEnabled {
    return _inlineCropView.aspectRatioLockDimensionSwapEnabled;
}

- (void)rotateImage:(BOOL)clockwise {
    [_inlineCropView rotateImageNinetyDegreesAnimated:YES clockwise:clockwise];
}

@end
