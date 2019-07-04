import React from 'react';
import { ImageStyle } from 'react-native';
import Image from 'react-native-fast-image';
import AutoHeightImage from 'react-native-auto-height-image';
import { Avatar } from 'components/avatar';
import { AutoWithImage } from './auto-width-image';

interface Props {
  url?: string;
  width?: number;
  height?: number;
  title?: string;
  auto?: string;
  style?: ImageStyle;
  resizeMode?: Image.ResizeMode;
  cache?: boolean;
}

export function Thumbnail({ auto, style, title, width, height, url, resizeMode, cache }: Props) {
  if (!url) {
    return <Avatar style={style} width={width} height={height} title={title} />;
  }

  if (auto === 'height') {
    return <AutoHeightImage style={style} width={width} source={{ uri: url }} />;
  }

  if (auto === 'width') {
    return <AutoWithImage width={width} height={height} style={style} url={url} />;
  }

  const source = { uri: url, cache: cache ? Image.cacheControl.immutable : Image.cacheControl.web };

  return <Image style={[style, { width, height }]} source={source} resizeMode={resizeMode} />;
}

Thumbnail.defaultProps = {
  auto: 'height',
  cache: true,
};
