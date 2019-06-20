import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

export class DetailsScreen extends React.Component<NavigationScreenProps> {
  render() {
    return <Text>Details! {this.props.navigation.getParam('bookId')}</Text>;
  }
}
