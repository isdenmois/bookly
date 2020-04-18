import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { session } from 'services';
import { clearCache } from 'services/api/base/create-api';
import { database } from 'store';
import { Button, ScreenHeader, ListItem } from 'components';
import { SessionEditor } from './components/session-param-editor';
import { SessionParamToggler } from './components/session-param-toggler';
import { BookListSort } from './components/book-list-sort';
import { RemoveDeleted } from './components/remove-deleted';

interface Props {
  navigation: NavigationScreenProp<any>;
}

export class ProfileScreen extends React.Component<Props> {
  render() {
    const v8runtime = (global as any)._v8runtime;
    const isHermes = (global as any).HermesInternal;
    const engine = v8runtime ? `V8 ${v8runtime().version}` : isHermes ? 'Hermes' : false;

    return (
      <View style={s.container}>
        <ScreenHeader title={session.userId} />

        <View style={s.content}>
          <SessionEditor title='Хочу читать книг в год' prop='totalBooks' />
          <SessionEditor title='Вести статистику с' prop='minYear' />
          <SessionParamToggler title='Синхронизировать с Fantlab' param='withFantlab' />
          <SessionParamToggler title='Сохранять дату в диалоге смене статуса' param='saveDateInChangeStatus' />
          <BookListSort />
          <RemoveDeleted />

          {__DEV__ && <ListItem label='Очистить API Cache' onPress={clearCache} last />}
          {engine && <ListItem label='Engine' value={engine} />}
        </View>

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
    session.stopSession();
    this.props.navigation.navigate('Login');
    database.action(() => database.unsafeResetDatabase());
  };
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.Background,
  } as ViewStyle,
  content: {
    paddingHorizontal: 15,
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
