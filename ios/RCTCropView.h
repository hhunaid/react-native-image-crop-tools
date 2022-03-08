//
//  RCTCropView.h
//  react-native-image-crop-tools
//
//  Created by Hunaid Hassan on 06/01/2020.
//

#import <React/RCTView.h>
#import <Photos/Photos.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTCropView : RCTView

@property (nonatomic, strong) NSString * sourceUrl;
@property (atomic, assign) BOOL keepAspectRatio;
@property (atomic, assign) BOOL iosDimensionSwapEnabled;
@property (nonatomic, assign) CGSize cropAspectRatio;
@property (nonatomic, strong) RCTDirectEventBlock onImageSaved;

- (UIImage *)getCroppedImage;
- (void)rotateImage:(BOOL)clockwise;

@end

NS_ASSUME_NONNULL_END
