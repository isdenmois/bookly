import React, { FC, useEffect } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Screen } from 'components';
import { saveSettings } from 'services/settings-sync';
import { SettingsEditor } from 'screens/settings/components/settings-param-editor';

export const ChallengeScreen: FC = () => {
  useEffect(() => saveSettings as () => void, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={s.content}>
        <SettingsEditor title='settings.totalBooks' param='totalBooks' />
        <SettingsEditor title='settings.challengePaper' param='challengePaper' />
        <SettingsEditor title='settings.challengeAudio' param='challengeAudio' />
        <SettingsEditor title='settings.challengeWithoutTranslation' param='challengeWithoutTranslation' />
      </ScrollView>
    </Screen>
  );
};

const s = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
