import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { Session, inject } from 'services';
import { clearCache } from 'services/api/base/create-api';
import { Button, ScreenHeader } from 'components';
import { ChallengeEditor } from './components/challenge-editor';

export class ProfileScreen extends React.Component<NavigationScreenProps> {
  session = inject(Session);
  database = inject(Database);

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title={this.session.userId} />

        <ChallengeEditor session={this.session} />

        {__DEV__ && (
          <View style={{ marginTop: 15, marginHorizontal: 20 }}>
            <Button label='Очистить API Cache' onPress={clearCache} />
          </View>
        )}

        {!!global.HermesInternal && (
          <View>
            <Text>Engine: Hermes</Text>
          </View>
        )}

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
