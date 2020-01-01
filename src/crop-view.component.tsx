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
};

type Props = {
  sourceUrl?: string;
  style?: StyleProp<ViewProps>;
  onImageCrop?: (res: Response) => void;
  keepAspectRatio?: boolean;
  aspectRatio?: number
};

class CropView extends React.PureComponent<Props> {
  public static defaultProps = {
    keepAspectRatio: false
  };

  public getCroppedImage = () => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.getViewManagerConfig('CropView').Commands.getCroppedImage,
      []
    );
  };

  public render() {
    const { sourceUrl, style, onImageCrop, keepAspectRatio, aspectRatio } = this.props;

    return (
      <RCTCropView
        sourceUrl={sourceUrl}
        style={style}
        onImageCropPress={(event: NativeSyntheticEvent<Response>) => {
          onImageCrop!(event.nativeEvent);
        }}
        keepAspectRatio={keepAspectRatio}
        cropAspectRatio={aspectRatio}
      />
    );
  }
}

export default CropView;
