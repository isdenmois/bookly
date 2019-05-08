import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { inject, InjectorContext } from 'react-ioc';
import { Database } from '@nozbe/watermelondb';
import { Session } from 'services';
import { ListItem } from 'components/list-item';

export class ProfileScreen extends React.Component<NavigationScreenProps> {
  static contextType = InjectorContext;

  session = inject(this, Session);
  database = inject(this, Database);

  render() {
    return (
      <View style={s.container}>
        <Text style={s.profile}>{this.session.userId}</Text>
        <ListItem last label='Выйти' onPress={this.logout} />
      </View>
    );
  }

  logout = () => {
    this.session.stopSession();
    this.props.navigation.navigate('Login');
    this.database.action(() => this.database.unsafeResetDatabase());
  };
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  } as ViewStyle,
  profile: {
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
  } as TextStyle,
});
