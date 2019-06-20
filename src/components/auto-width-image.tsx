import React from 'react';
import Image, { ImageStyle } from 'react-native-fast-image';

interface Props {
  url: string;
  height: number;
  width?: number;
  style?: ImageStyle;
}

interface State {
  width: number;
}

export class AutoWithImage extends React.Component<Props, State> {
  static widthCache: Map<string, number> = new Map();

  state: State = {
    width: AutoWithImage.widthCache.get(this.props.url) || null,
  };

  render() {
    const style = [this.props.style, { width: this.state.width, height: this.props.height }];

    return <Image style={style} source={{ uri: this.props.url }} onLoad={this.setWidth} />;
  }

  setWidth = event => {
    if (!AutoWithImage.widthCache.has(this.props.url)) {
      const width = Math.round((event.nativeEvent.width * this.props.height) / event.nativeEvent.height);

      AutoWithImage.widthCache.set(this.props.url, width);

      this.setState({ width });
    }
  };
}
