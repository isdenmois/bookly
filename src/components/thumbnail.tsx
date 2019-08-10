import React from 'react';
import { ImageStyle } from 'react-native';
import Image from 'react-native-fast-image';
import { Avatar } from 'components/avatar';
import { AutoSizeImage } from './auto-size-image';

const THUMBNAIL_URL = 'https://data.fantlab.ru/images/editions/big';

export function getThumbnailUrl(url: string) {
  if (+url) {
    return `${THUMBNAIL_URL}/${url}`;
  }
  return url;
}

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

  url = getThumbnailUrl(url);

  if (auto === 'height' || auto === 'width') {
    return <AutoSizeImage auto={auto} style={style} width={width} height={height} url={url} />;
  }

  const source = { uri: url, cache: cache ? Image.cacheControl.immutable : Image.cacheControl.web };

  return <Image style={[style, { width, height }]} source={source} resizeMode={resizeMode} />;
}

Thumbnail.defaultProps = {
  auto: 'height',
};
