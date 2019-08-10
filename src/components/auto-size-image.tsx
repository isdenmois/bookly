import React from 'react';
import Image, { ImageStyle } from 'react-native-fast-image';

interface Props {
  url: string;
  auto: 'width' | 'height';
  height: number;
  width?: number;
  style?: ImageStyle;
}

interface ImageSize {
  width: number;
  height: number;
}

const CACHE: Map<string, ImageSize> = new Map();

export class AutoSizeImage extends React.Component<Props, ImageSize> {
  state: ImageSize = this.getInitialState();

  render() {
    const style = [this.props.style, this.state];

    return <Image style={style} source={{ uri: this.props.url }} onLoad={this.setSize} />;
  }

  getInitialState(): ImageSize {
    if (CACHE.has(this.props.url)) {
      return this.getImageSize(CACHE.get(this.props.url));
    }

    return { width: this.props.width, height: this.props.height };
  }

  getImageSize(original: ImageSize): ImageSize {
    let { width, height } = this.props;

    if (this.props.auto === 'height') {
      height = (original.height * width) / original.width;
    } else {
      width = (original.width * height) / original.height;
    }

    return { width, height };
  }

  setSize = event => {
    if (!CACHE.has(this.props.url)) {
      CACHE.set(this.props.url, { width: event.nativeEvent.width, height: event.nativeEvent.height });
    }

    const size = this.getImageSize(event.nativeEvent);

    if (size.height !== this.state.height || size.width !== this.state.width) {
      this.setState(size);
    }
  };
}
