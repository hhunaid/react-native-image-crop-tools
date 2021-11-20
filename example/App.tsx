import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {getBottomSpace} from 'react-native-iphone-x-helper';

import ActionSheet from 'react-native-actions-sheet';
import {CropView} from '../src';

const {height} = Dimensions.get('window');
const hitSlop = {top: 10, left: 10, bottom: 0, right: 10};

const getAspectRatioText = (
  aspectRatio: {width: number; height: number} | undefined,
  keepAspectRatio: boolean,
) => {
  if (aspectRatio == null) {
    return 'Free';
  }
  const isSquare = aspectRatio.width === 4 && aspectRatio.height === 4;
  if (keepAspectRatio && !isSquare) {
    return `${aspectRatio.width}:${aspectRatio.height}`;
  }
  if (isSquare) {
    return 'Square';
  }
  return `${aspectRatio.width}:${aspectRatio.height}`;
};

const App = () => {
  const [openCrop, setOpenCrop] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<
    | {
        width: number;
        height: number;
      }
    | undefined
  >(undefined);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const cropViewRef = useRef<CropView>(null);

  const actionSheetRef = useRef<ActionSheet>(null);

  const pickImage = useCallback(async () => {
    setCroppedImage(null);
    return new Promise<string | null>((resolve, reject) => {
      launchImageLibrary(
        {
          includeBase64: false,
          mediaType: 'photo',
        },
        (res: ImagePickerResponse) => {
          if (res.didCancel) {
            setImage('');
            setOpenCrop(false);
            reject(res.errorMessage);
          } else {
            setImage(res?.assets?.[0].uri || null);
            setOpenCrop(true);
            resolve(res?.assets?.[0].uri || null);
          }
        },
      );
    });
  }, []);

  const closeSheet = useCallback(() => {
    actionSheetRef?.current?.hide();
  }, []);

  const openSheet = useCallback(() => {
    actionSheetRef?.current?.show();
  }, []);

  const rotateImage = useCallback(() => {
    if (cropViewRef?.current) {
      cropViewRef.current.rotateImage(true);
    }
  }, []);

  const changeAspectRatio = (type: string) => {
    actionSheetRef?.current?.hide();
    if (type === 'free') {
      setKeepAspectRatio(false);
    } else {
      setKeepAspectRatio(true);
    }
    switch (type) {
      case 'square':
        return setAspectRatio({width: 4, height: 4});
      case '16:9':
        return setAspectRatio({width: 16, height: 9});
      case '9:16':
        return setAspectRatio({width: 9, height: 16});
      case '4:3':
        return setAspectRatio({width: 4, height: 3});
      case '3:4':
        return setAspectRatio({width: 3, height: 4});
      case 'free':
        return setAspectRatio(undefined);
      default:
        setKeepAspectRatio(true);
        setAspectRatio({width: 9, height: 16});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pickImageButtonWrapper}>
        <Button
          onPress={pickImage}
          title="Pick Image"
          color={Platform.OS === 'ios' ? 'white' : 'black'}
        />
        {croppedImage ? (
          <Image
            resizeMode="cover"
            source={{uri: croppedImage}}
            style={styles.previewImage}
          />
        ) : null}
      </View>
      <Modal style={styles.modal} visible={openCrop}>
        <View style={styles.modalCloseButtonWrapper}>
          <TouchableOpacity
            onPress={() => setOpenCrop(false)}
            hitSlop={hitSlop}>
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
        <CropView
          aspectRatio={aspectRatio}
          keepAspectRatio={keepAspectRatio}
          onImageCrop={({uri}) => setCroppedImage(uri)}
          ref={cropViewRef}
          sourceUrl={image as string}
          style={styles.cropView}
        />
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity onPress={openSheet}>
            <View style={styles.button}>
              <Image
                style={styles.buttonImage}
                source={require('./assets/crop.png')}
              />
              <Text style={styles.buttonsText}>
                {getAspectRatioText(aspectRatio, keepAspectRatio)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={rotateImage}>
            <View style={styles.button}>
              <Image
                style={styles.buttonImage}
                source={require('./assets/rotate.png')}
              />
              <Text style={styles.buttonsText}>Rotate</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ActionSheet ref={actionSheetRef}>
          <View>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('square')}>
              Square
            </Text>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('16:9')}>
              16:9
            </Text>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('9:16')}>
              9:16
            </Text>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('4:3')}>
              4:3
            </Text>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('3:4')}>
              3:4
            </Text>
            <Text
              style={styles.actionSheetText}
              onPress={() => changeAspectRatio('free')}>
              Free
            </Text>
          </View>
          <View style={styles.actionSheetButtonWrapper}>
            <Button title="Close Sheet" onPress={closeSheet} />
          </View>
        </ActionSheet>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  pickImageButtonWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  previewImage: {
    height: 200,
    marginTop: 12,
    width: 200,
  },
  modal: {
    backgroundColor: 'black',
    flex: 1,
  },
  modalCloseButtonWrapper: {
    backgroundColor: 'black',
    paddingLeft: 12,
    paddingTop: Platform.select({
      android: 0,
      ios: 40,
    }),
  },
  closeModalText: {
    color: 'white',
    fontSize: 18,
  },
  cropView: {
    backgroundColor: 'black',
    height: height - getBottomSpace() - 140,
  },
  buttonsWrapper: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  button: {
    alignItems: 'center',
  },
  buttonImage: {
    height: 44,
    width: 44,
  },
  buttonsText: {
    color: 'white',
    marginTop: 4,
  },
  actionSheetText: {
    fontSize: 20,
    margin: 14,
    marginLeft: 24,
  },
  actionSheetButtonWrapper: {
    marginBottom: getBottomSpace() + 12,
    marginHorizontal: 24,
  },
});

export default App;
