//
//  RCTCropView.m
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 06/01/2020.
//

#import "RCTCropView.h"
#import <TOCropViewController/TOCropView.h>
#import <TOCropViewController/UIImage+CropRotate.h>

@implementation RCTCropView {
    TOCropView * _inlineCropView;
}

@synthesize sourceUrl, keepAspectRatio, cropAspectRatio;

- (void)layoutSubviews {
    if (_inlineCropView == nil) {
        UIImage * image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:self.sourceUrl]]];
        _inlineCropView = [[TOCropView alloc] initWithImage:image];
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
