import React from 'react';
import {
  findNodeHandle,
  NativeSyntheticEvent,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewProps,
} from 'react-native';

const RCTCropView = requireNativeComponent('CropView');

type Response = {
  uri: string;
  width: number;
  height: number;
}

type Props = {
  sourceUrl?: string;
  style?: StyleProp<ViewProps>
  onImageCrop?: (res: Response) => void;
}

class CropView extends React.PureComponent<Props> {
  public getCroppedImage = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('CropView').Commands
        .getCroppedImage,
      [],
    );
  };

  public render() {
    const { sourceUrl, style, onImageCrop } = this.props;

    return (
      <RCTCropView sourceUrl={sourceUrl} style={style} onImageCropPress={(event: NativeSyntheticEvent<Response>) => {
        onImageCrop!(event.nativeEvent);
      }}/>
    );
  }
}

export default CropView;
