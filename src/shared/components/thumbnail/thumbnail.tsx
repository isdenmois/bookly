import React from 'react';
import { Image, ImageStyle } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { Avatar } from 'components/avatar';

interface Props {
  url?: string;
  width: number;
  height?: number;
  title?: string;
  auto?: boolean;
  style?: ImageStyle;
}

export function Thumbnail({ auto, style, title, width, height, url }: Props) {
  return url ? (
    auto ? (
      <AutoHeightImage style={style} width={width} source={{ uri: url }} />
    ) : (
      <Image style={style} height={height} width={width} source={{ uri: url }} />
    )
  ) : (
    <Avatar style={style} width={width} height={height} title={title} />
  );
}

Thumbnail.defaultProps = {
  auto: true,
};
