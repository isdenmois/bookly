import React from 'react';
import { Linking, StyleSheet, View, TextStyle, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { TouchIcon } from 'components';

interface Props extends NavigationScreenProps {
  bookId: string;
}

export class BookDetailsHeader extends React.PureComponent<Props> {
  render() {
    return (
      <View style={s.container}>
        <TouchIcon
          style={s.icon}
          paddingHorizontal={15}
          name='arrow-left'
          size={24}
          color='white'
          onPress={this.goBack}
        />
        {this.props.children}
        <TouchIcon style={s.icon} paddingHorizontal={15} name='globe' size={24} color='white' onPress={this.openWeb} />
      </View>
    );
  }

  openWeb = () => Linking.openURL(`https://fantlab.ru/work${this.props.bookId}`);
  goBack = () => this.props.navigation.goBack();
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
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
