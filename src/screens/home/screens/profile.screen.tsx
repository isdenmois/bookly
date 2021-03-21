import React, { FC } from 'react';
import { Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native';

import { Button, ListItem, Screen } from 'components';
import { NavigationLinks } from '../components/navigation-links';
import { MainRoutes, MainScreenProps } from 'navigation/routes';
import { RemoveDeleted } from 'screens/home/components/remove-deleted';
import { clearCache } from 'services/api/base/create-api';
import { database, settings } from 'services';
import { Box, Text } from 'components/theme';
import { resetSettings } from 'services/settings';

type Props = MainScreenProps<MainRoutes.Home>;

export const ProfileScreen: FC<Props> = ({ navigation }) => {
  const openSettings = () => navigation.push(MainRoutes.Settings);
  const openLists = () => navigation.push(MainRoutes.Lists);
  const logout = () => {
    resetSettings();
    setTimeout(() => database.action(() => database.unsafeResetDatabase()), 500);
  };

  const isWeb = Platform.OS === 'web';

  return (
    <Screen>
      <Box mt={2} alignItems='center'>
        <Text variant='title'>{settings.userId}</Text>
      </Box>

      <ScrollView contentContainerStyle={s.content}>
        <ListItem label='Настройки' onPress={openSettings} />
        <ListItem label='Списки книг' onPress={openLists} />

        <RemoveDeleted />

        {isWeb && <ListItem label='Версия' value={process.env.VERSION} onPress={() => (global as any).wb.update()} />}
        {__DEV__ && <ListItem label='Очистить API Cache' onPress={clearCache} last />}

        <NavigationLinks />
      </ScrollView>

      <Box position='absolute' bottom={24} left={0} right={0} alignItems='center'>
        <Button label='Выйти' onPress={logout} />
      </Box>
    </Screen>
  );
};

const s = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 70,
  } as ViewStyle,
});
