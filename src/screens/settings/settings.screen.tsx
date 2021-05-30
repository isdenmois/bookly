import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet, Platform, ScrollView } from 'react-native';
import { saveSettings } from 'services/settings-sync';
import { Setting } from 'services/settings';
import { Screen } from 'components';
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
  param: Setting;
  isWeb?: boolean;
};

const COMPONENTS: Record<SettingType, any> = {
  [SettingType.Editor]: SettingsEditor,
  [SettingType.Toggler]: SettingsParamToggler,
};

const LINES: SettingLine[] = [
  { type: SettingType.Editor, param: 'totalBooks' },
  { type: SettingType.Editor, param: 'minYear' },
  { type: SettingType.Toggler, param: 'withFantlab' },
  { type: SettingType.Toggler, param: 'saveDateInChangeStatus' },
  { type: SettingType.Toggler, param: 'audio' },
  { type: SettingType.Toggler, param: 'withoutTranslation' },
  { type: SettingType.Toggler, param: 'paper' },
  { type: SettingType.Toggler, param: 'topRate' },
  { type: SettingType.Toggler, param: 'authors' },
];

export function SettingsScreen() {
  const isWeb = Platform.OS === 'web';

  useEffect(() => saveSettings, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.content}>
        {LINES.map(line => {
          if (line.isWeb !== undefined && line.isWeb !== isWeb) return null;
          const Component = COMPONENTS[line.type];

          return <Component key={line.param} title={`settings.${line.param}`} param={line.param} />;
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
