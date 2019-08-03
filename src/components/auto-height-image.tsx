import React from 'react';
import Image, { ImageStyle } from 'react-native-fast-image';

interface Props {
  url: string;
  height?: number;
  width: number;
  style?: ImageStyle;
}

interface State {
  height: number;
}

export class AutoHeightImage extends React.Component<Props, State> {
  static heightCache: Map<string, number> = new Map();

  state: State = {
    height: AutoHeightImage.heightCache.get(this.props.url) || this.props.height,
  };

  render() {
    const style = [this.props.style, { height: this.state.height, width: this.props.width }];

    return <Image style={style} source={{ uri: this.props.url }} onLoad={this.setHeight} />;
  }

  setHeight = event => {
    if (!AutoHeightImage.heightCache.has(this.props.url)) {
      const height = Math.round((event.nativeEvent.height * this.props.width) / event.nativeEvent.width);

      AutoHeightImage.heightCache.set(this.props.url, height);

      this.setState({ height });
    }
  };
}
