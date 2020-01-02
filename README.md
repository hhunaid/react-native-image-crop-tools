# react-native-image-crop-tools

## Getting started

`$ yarn add react-native-image-crop-tools`

### Mostly Automatic installation

Only RN > 0.61.x is supported. Installation is automatic on Android. For iOS, if your project doesn't have Swift already set up you need to do following.

1. Add a blank Swift file to your project. Xcode will ask if you want to create a brdiging header you can choose to add it or not. What this does is tells Xcode to bundle Swift libraries. This will add a couple of MBs to your application
2. Make sure you are using Xcode 11 because only Swift 5.x is supported
   
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

For detailed usage check out the example app.

#### TODO:

- [ ] Add screenshots
- [ ] Add access to prebuilt UI for those who want to use it.