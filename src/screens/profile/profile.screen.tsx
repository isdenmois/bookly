import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, ViewStyle, TextStyle, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import { dynamicColor, getColor } from 'types/colors';
import { session } from 'services';
import { clearCache } from 'services/api/base/create-api';
import { database } from 'store';
import { saveSettings } from 'services/settings-sync';
import { Button, ScreenHeader, ListItem, Screen } from 'components';
import { SessionEditor } from './components/session-param-editor';
import { SessionParamToggler } from './components/session-param-toggler';
import { BookListSort } from './components/book-list-sort';
import { RemoveDeleted } from './components/remove-deleted';
import { ThemeSelector } from './components/theme-selector';
import { LanguageSelector } from './components/language-selector';

interface Props {
  navigation: NavigationScreenProp<any>;
}

export class ProfileScreen extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  render() {
    const isWeb = Platform.OS === 'web';
    const s = ds[this.context];
    const color = getColor(this.context);

    return (
      <Screen>
        <ScreenHeader title={session.userId} />

        <ScrollView contentContainerStyle={s.content}>
          <SessionEditor title='Хочу читать книг в год' prop='totalBooks' />
          <SessionEditor title='Вести статистику с' prop='minYear' />
          <SessionParamToggler title='Синхронизировать с Fantlab' param='withFantlab' />
          <SessionParamToggler title='Сохранять дату в диалоге смене статуса' param='saveDateInChangeStatus' />
          <SessionParamToggler title='Типы книг: аудио' param='audio' />
          <SessionParamToggler title='Типы книг: оригинал' param='withoutTranslation' />
          <SessionParamToggler title='Типы книг: бумага' param='paper' />
          <SessionParamToggler title='Топ книг' param='topRate' />
          <SessionParamToggler title='Интересные авторы' param='authors' />
          {!isWeb && <SessionParamToggler title='Искать в BookUploader' param='searchApp' />}
          {isWeb && <SessionParamToggler title='Сохранять состояние приложения' param='persistState' />}
          {isWeb && <LanguageSelector />}
          <ThemeSelector />
          <BookListSort />
          <RemoveDeleted />

          {isWeb && <ListItem label='Версия' value={process.env.VERSION} onPress={() => (global as any).wb.update()} />}
          {__DEV__ && <ListItem label='Очистить API Cache' onPress={clearCache} last />}
        </ScrollView>

        <View style={s.buttonContainer}>
          <Button
            label='Выйти'
            onPress={this.logout}
            icon={<Icon name='sign-out-alt' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
      </Screen>
    );
  }

  componentWillUnmount() {
    saveSettings();
  }

  logout = () => {
    session.stopSession();
    this.props.navigation.navigate('Login');
    database.action(() => database.unsafeResetDatabase());
  };
}

const ds = new DynamicStyleSheet({
  content: {
    paddingHorizontal: 15,
    paddingBottom: 70,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: dynamicColor.SearchBackground,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 4px #0003',
      },
    }),
  } as ViewStyle,
  buttonText: {
    color: dynamicColor.PrimaryText,
  } as TextStyle,
});
