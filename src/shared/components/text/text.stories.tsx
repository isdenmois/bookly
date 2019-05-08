import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, ViewStyle } from 'react-native';
import { TextXs, TextS, TextM, TextL, TextXL } from './text';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF',
} as ViewStyle;

const CenteredView = ({ children }) => <View style={style}>{children}</View>;

storiesOf('Text').add('Usage', () => (
  <CenteredView>
    <TextXs>Xs</TextXs>
    <TextS>S</TextS>
    <TextM>M</TextM>
    <TextL>L</TextL>
    <TextXL>XL</TextXL>
  </CenteredView>
));
