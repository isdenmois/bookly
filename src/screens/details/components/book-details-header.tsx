import React from 'react';
import { Linking, StyleSheet, View, TextStyle, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { TouchIcon } from 'components';

interface Props {
  bookId: string;
  onBack: () => void;
}

export class BookDetailsHeader extends React.PureComponent<Props> {
  render() {
    return (
      <View style={s.container}>
        <TouchIcon
          style={s.icon}
          paddingHorizontal={15}
          paddingVertical={10}
          name='arrow-left'
          size={24}
          color='white'
          onPress={this.props.onBack}
        />
        <TouchIcon
          style={s.icon}
          paddingHorizontal={15}
          paddingVertical={10}
          name='globe'
          size={24}
          color='white'
          onPress={this.openWeb}
        />
      </View>
    );
  }

  openWeb = () => Linking.openURL(`https://fantlab.ru/work${this.props.bookId}`);
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  } as ViewStyle,
  icon: {
    zIndex: 2,
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  } as TextStyle,
  iconPlaceholder: {
    width: 45,
  },
});
