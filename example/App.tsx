import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  Modal,
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

const getAspectRatioText = (
  aspect: {width: number; height: number} | undefined,
  keepAR: boolean,
) => {
  if (aspect == null) {
    return 'Free';
  }
  const isSquare = aspect.width === 4 && aspect.height === 4;
  if (keepAR && !isSquare) {
    return `${aspect.width}:${aspect.height}`;
  }
  if (isSquare) {
    return 'Square';
  }
  return `${aspect.width}:${aspect.height}`;
};

const App = () => {
  const [openCrop, setOpenCrop] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>('');
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
    switch (type) {
      case 'square':
        setKeepAspectRatio(true);
        return setAspectRatio({width: 4, height: 4});
      case '16:9':
        setKeepAspectRatio(true);
        return setAspectRatio({width: 16, height: 9});
      case '9:16':
        setKeepAspectRatio(true);
        return setAspectRatio({width: 9, height: 16});
      case '4:3':
        setKeepAspectRatio(true);
        return setAspectRatio({width: 4, height: 3});
      case '3:4':
        setKeepAspectRatio(true);
        return setAspectRatio({width: 3, height: 4});
      case 'free':
        setKeepAspectRatio(false);
        return setAspectRatio(undefined);
      default:
        setKeepAspectRatio(true);
        setAspectRatio({width: 9, height: 16});
    }
  };

  return (
    <SafeAreaView>
      <Button onPress={pickImage} title="Pick Image" />
      <Modal style={styles.modal} visible={openCrop}>
        <View style={styles.modalCloseButtonWrapper}>
          <TouchableOpacity
            onPress={() => setOpenCrop(false)}
            hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}>
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View>
          <CropView
            aspectRatio={aspectRatio}
            keepAspectRatio={keepAspectRatio}
            // tslint:disable-next-line:no-empty
            onImageCrop={() => {}}
            ref={cropViewRef}
            sourceUrl={image as string}
            style={styles.cropView}
          />
        </View>

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
  modal: {
    backgroundColor: 'black',
    flex: 1,
  },
  cropView: {
    backgroundColor: 'black',
    height: height - getBottomSpace() - 140,
    margin: 2,
  },
  actionSheetText: {
    fontSize: 20,
    margin: 14,
    marginLeft: 24,
  },
  buttonsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  buttonImage: {
    width: 44,
    height: 44,
  },
  button: {
    alignItems: 'center',
  },
  buttonsText: {
    marginTop: 4,
  },
  actionSheetButtonWrapper: {
    marginBottom: getBottomSpace(),
  },
  closeModalText: {
    fontSize: 18,
  },
  modalCloseButtonWrapper: {
    marginTop: 40,
    marginLeft: 24,
  },
});

export default App;
