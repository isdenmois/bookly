import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { Screen } from 'components';
import { NavigationLinks } from '../components/navigation-links';

export const ProfileScreen: FC = () => {
  return (
    <Screen>
      <View style={s.container}>
        <NavigationLinks />
      </View>
    </Screen>
  );
};

const s = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingHorizontal: 24,
    flex: 1,
  } as ViewStyle,
});
