import React, { FC } from 'react';
import { Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useStore } from '@nanostores/react';

import { $isAuthorsEnabled } from 'entities/settings';
import { RemoveDeletedLineItem } from 'features/profile/remove-deleted';

import { database, settings, t } from 'services';
import { resetSettings } from 'services/settings';
import { clearCache } from 'services/api/base/create-api';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

import { Button, ListItem, Screen } from 'components';
import { Box, Text } from 'components/theme';

type Props = MainScreenProps<MainRoutes.Home>;

export const ProfileScreen: FC<Props> = ({ navigation }) => {
  const isAuthorsEnabled = useStore($isAuthorsEnabled);
  const openSettings = () => navigation.push(MainRoutes.Settings);
  const openLists = () => navigation.push(MainRoutes.Lists);
  const openAuthors = () => navigation.push(MainRoutes.Authors);
  const logout = () => {
    resetSettings();
    setTimeout(() => database.write(() => database.unsafeResetDatabase()), 500);
  };

  const isWeb = Platform.OS === 'web';

  return (
    <Screen>
      <Box mt={2} alignItems='center'>
        <Text variant='title'>{settings.userId}</Text>
      </Box>

      <ScrollView contentContainerStyle={s.content}>
        <ListItem label='nav.settings' onPress={openSettings} />
        <ListItem label='headers.lists' onPress={openLists} />
        {isAuthorsEnabled && <ListItem label='nav.authors' onPress={openAuthors} />}

        <RemoveDeletedLineItem />

        {isWeb && <ListItem label='Версия' value={process.env.VERSION} onPress={() => (global as any).wb.update()} />}
        {__DEV__ && <ListItem label='Очистить API Cache' onPress={clearCache} last />}
      </ScrollView>

      <Box position='absolute' bottom={24} left={0} right={0} alignItems='center'>
        <Button label={t('button.apply')} onPress={logout} />
      </Box>
    </Screen>
  );
};

const s = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 70,
  } as ViewStyle,
});
