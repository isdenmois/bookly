import React from 'react';
import { Linking, StyleSheet, View, TextStyle, ViewStyle } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { color } from 'types/colors';
import { TouchIcon } from 'components';

interface Props {
  bookId: string;
  navigation: NavigationStackProp<any>;
}

export class BookDetailsHeader extends React.PureComponent<Props> {
  get url() {
    const { bookId } = this.props;

    return bookId && bookId.startsWith('l_')
      ? `https://livelib.ru/book/${this.props.bookId.replace('l_', '')}`
      : `https://fantlab.ru/work${this.props.bookId}`;
  }

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
          onLongPress={this.goToHome}
          testID='goBackButton'
        />
        {this.props.children}
        <TouchIcon style={s.icon} paddingHorizontal={15} name='globe' size={24} color='white' onPress={this.openWeb} />
      </View>
    );
  }

  openWeb = () => Linking.openURL(this.url);
  goBack = () => this.props.navigation.goBack();
  goToHome = () => this.props.navigation.popToTop();
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
