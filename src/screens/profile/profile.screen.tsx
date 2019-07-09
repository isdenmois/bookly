import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { inject, InjectorContext } from 'react-ioc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { Session } from 'services';
import { Button } from 'components/button';
import { ScreenHeader } from 'components/screen-header';
import { ChallengeEditor } from './components/challenge-editor';

export class ProfileScreen extends React.Component<NavigationScreenProps> {
  static contextType = InjectorContext;

  session = inject(this, Session);
  database = inject(this, Database);

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title={this.session.userId} navigation={this.props.navigation} />

        <ChallengeEditor session={this.session} />

        <View style={s.buttonContainer}>
          <Button
            label='Выйти'
            onPress={this.logout}
            icon={<Icon name='sign-out-alt' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
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
    backgroundColor: color.Background,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});
