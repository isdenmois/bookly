import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, Text, ViewStyle } from 'react-native';
import { Card } from './card';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF',
} as ViewStyle;

const CenteredView = ({ children }) => <View style={style}>{children}</View>;

const statusOptions = [
  { key: 'NOW_READING', title: 'Читаю сейчас' },
  { key: 'WANT_TO_READ', title: 'Хочу прочитать' },
  { key: 'HAVE_READ', title: 'Прочитано' },
];

storiesOf('Card')
  .add('Usage', () => (
    <CenteredView>
      <Card>
        <Text>test</Text>
      </Card>
    </CenteredView>
  ))
  .add('With padding', () => (
    <CenteredView>
      <Card padding>
        <Text>test</Text>
      </Card>
    </CenteredView>
  ))
  .add('With title', () => (
    <CenteredView>
      <Card padding title='Some title'>
        <Text>test</Text>
      </Card>
    </CenteredView>
  ));
