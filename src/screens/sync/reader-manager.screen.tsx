import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { withNavigationProps } from 'utils/with-navigation-props';
import { ScreenHeader } from 'components';

interface Props {
  address: string;
}

export const ReaderManagerScreen = withNavigationProps()(({ address }: Props) => {
  if (__DEV__) {
    address = address.replace(':8080', ':4000');
  }

  return (
    <View style={s.container}>
      <ScreenHeader title='Менеджер читалки' />
      <View style={s.webview}>
        <WebView allowFileAccess source={{ uri: address }} cacheEnabled={false} />
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  } as ViewStyle,
  webview: {
    flex: 1,
  } as ViewStyle,
});
