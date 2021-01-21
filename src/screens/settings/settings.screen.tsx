import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet, Platform, ScrollView } from 'react-native';
import { saveSettings } from 'services/settings-sync';
import { Setting } from 'services/settings';
import { ScreenHeader, Screen } from 'components';
import { SettingsEditor } from './components/settings-param-editor';
import { SettingsParamToggler } from './components/settings-param-toggler';
import { BookListSort } from './components/book-list-sort';
import { ThemeSelector } from './components/theme-selector';
import { LanguageSelector } from './components/language-selector';

enum SettingType {
  Editor,
  Toggler,
}

type SettingLine = {
  type: SettingType;
  title: string;
  param: Setting;
  isWeb?: boolean;
};

const COMPONENTS: Record<SettingType, any> = {
  [SettingType.Editor]: SettingsEditor,
  [SettingType.Toggler]: SettingsParamToggler,
};

const LINES: SettingLine[] = [
  { type: SettingType.Editor, title: 'Хочу читать книг в год', param: 'totalBooks' },
  { type: SettingType.Editor, title: 'Вести статистику с', param: 'minYear' },
  { type: SettingType.Toggler, title: 'Синхронизировать с Fantlab', param: 'withFantlab' },
  { type: SettingType.Toggler, title: 'Сохранять дату в диалоге смене статуса', param: 'saveDateInChangeStatus' },
  { type: SettingType.Toggler, title: 'Типы книг: аудио', param: 'audio' },
  { type: SettingType.Toggler, title: 'Типы книг: английский', param: 'withoutTranslation' },
  { type: SettingType.Toggler, title: 'Типы книг: бумага', param: 'paper' },
  { type: SettingType.Toggler, title: 'Топ книг', param: 'topRate' },
  { type: SettingType.Toggler, title: 'Интересные авторы', param: 'authors' },
  { type: SettingType.Toggler, title: 'Сохранять состояние приложения', param: 'persistState', isWeb: true },
];

export function SettingsScreen() {
  const isWeb = Platform.OS === 'web';

  useEffect(() => saveSettings, []);

  return (
    <Screen>
      <ScreenHeader title='Настройки' />

      <ScrollView contentContainerStyle={s.content}>
        {LINES.map(line => {
          if (line.isWeb !== undefined && line.isWeb !== isWeb) return null;
          const Component = COMPONENTS[line.type];

          return <Component key={line.param} title={line.title} param={line.param} />;
        })}

        {isWeb && <LanguageSelector />}
        <ThemeSelector />
        <BookListSort />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
