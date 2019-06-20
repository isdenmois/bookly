import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { inject, InjectorContext } from 'react-ioc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Database } from '@nozbe/watermelondb';
import { Session } from 'services';
import { TouchIcon } from 'components/touch-icon';
import { Button } from 'components/button';

export class ProfileScreen extends React.Component<NavigationScreenProps> {
  static contextType = InjectorContext;

  session = inject(this, Session);
  database = inject(this, Database);

  render() {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchIcon
            paddingHorizontal={10}
            paddingVertical={10}
            name='arrow-left'
            size={24}
            color='#000'
            onPress={this.goBack}
          />
          <Text style={s.profile}>{this.session.userId}</Text>
        </View>
        <View style={s.buttonContainer}>
          <Button
            label='Выйти'
            onPress={this.logout}
            icon={<Icon name='sign-out-alt' size={18} color='black' />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
      </View>
    );
  }

  goBack = () => this.props.navigation.pop();

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  profile: {
    flex: 1,
    marginRight: 44,
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
  } as TextStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: 'white',
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: 'black',
  } as TextStyle,
});
