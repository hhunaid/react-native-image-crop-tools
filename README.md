# react-native-image-crop-tools

## Previews

![](https://github.com/hhunaid/react-native-image-crop-tools/blob/master/previews/android-preview.gif?raw=true) ![](https://github.com/hhunaid/react-native-image-crop-tools/blob/master/previews/ios-preview.gif?raw=true)

## Getting started

`$ yarn add react-native-image-crop-tools`

### Mostly Automatic installation

Only RN > 0.61.x is supported. Installation is automatic on Android. For iOS. Remember to run `pod install` in iOS directory
   
### Why another cropping library?

Most cropping tools available for RN are usually wrappers over popular native tools which itself isn't a bad thing. But this means you are stuck with their UI and feature set. The ones made in RN are not the most optimized and correct tools.

## Features

1. Native views. Which means performance even on low end devices.
2. You can embed the view into you own UI. It's not very customizable (yet)
3. Change and lock/unlock aspect ratio on the fly (This is the main reason I am making this library)

# NOTE

This library is not supposed to work with local images. There are very few usecases for that. You need to provide a sourceUrl string which you can obtain from image pickers or downloading using rn-fetch-blob

## Usage
```javascript
import { CropView } from 'react-native-image-crop-tools';

        <CropView
          sourceUrl={uri}
          style={styles.cropView}
          ref={cropViewRef}
          onImageCrop={(res) => console.warn(res)}
          keepAspectRatio
          aspectRatio={16.0 / 9.0}
        />
```

Two methods are exposed on the ref you can use them as follows

```javascript
  this.cropViewRef.saveImage(90 // image quality percentage)
  this.cropViewRef.rotateImage(true // true for clockwise, false for counterclockwise)
```

For detailed usage check out the example app.

#### TODO:

- [x] Add screenshots
- [ ] Add access to prebuilt UI for those who want to use it.