import React, { createRef } from 'react';
import {
  findNodeHandle,
  NativeSyntheticEvent,
  requireNativeComponent,
  StyleProp,
  UIManager,
  ViewStyle,
} from 'react-native';

const RCTCropView = requireNativeComponent('CropView');

type Response = {
  uri: string;
  width: number;
  height: number;
};

type Props = {
  sourceUrl: string;
  style?: StyleProp<ViewStyle>;
  onImageCrop?: (res: Response) => void;
  keepAspectRatio?: boolean;
  aspectRatio?: number;
};

class CropView extends React.PureComponent<Props> {
  public static defaultProps = {
    keepAspectRatio: false,
  };

  private viewRef = createRef<any>();

  public saveImage = (quality: number) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.viewRef.current!),
      UIManager.getViewManagerConfig('CropView').Commands.saveImage,
      [quality],
    );
  };

  public render() {
    const { sourceUrl, style, onImageCrop, keepAspectRatio, aspectRatio } = this.props;

    return (
      <RCTCropView
        ref={this.viewRef}
        sourceUrl={sourceUrl}
        style={style}
        onImageSaved={(event: NativeSyntheticEvent<Response>) => {
          onImageCrop!(event.nativeEvent);
        }}
        keepAspectRatio={keepAspectRatio}
        cropAspectRatio={aspectRatio}
      />
    );
  }
}

export default CropView;
