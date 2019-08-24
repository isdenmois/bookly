import React from 'react';
import Image, { ImageStyle } from 'react-native-fast-image';

interface Props {
  url: string;
  auto: 'width' | 'height';
  height: number;
  width?: number;
  style?: ImageStyle;
  cache?: boolean;
}

interface ImageSize {
  width: number;
  height: number;
}

const CACHE: Map<string, ImageSize> = new Map();

export class AutoSizeImage extends React.PureComponent<Props, ImageSize> {
  state: ImageSize = this.getInitialState();
  private _source = null;
  private _style = null;

  get source() {
    if (!this._source || this.props.url !== this._source.uri) {
      this._source = {
        uri: this.props.url,
        cache: this.props.cache ? Image.cacheControl.immutable : Image.cacheControl.web,
      };
    }

    return this._source;
  }

  get style() {
    if (!this._style || this._style[1] !== this.state) {
      this._style = [this.props.style, this.state];
    }

    return this._style;
  }

  render() {
    return (
      <Image style={this.style} source={this.source} onLoad={this.setSize} resizeMode={Image.resizeMode.stretch} />
    );
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

    const size = this.getImageSize(CACHE.get(this.props.url));

    if (size.height !== this.state.height || size.width !== this.state.width) {
      this.setState(size);
    }
  };
}
