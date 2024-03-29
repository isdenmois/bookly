import React, { FC, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LinkingOptions, NavigationContainer, Theme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { DynamicValue, useDynamicValue } from 'react-native-dynamic';

import { light, dark } from 'types/colors';
import { useSetting } from 'services/settings';
import { onChanges } from 'store';
import { syncService } from 'services';

import { MainNavigator, mainScreens } from './main-navigator';
import { AuthNavigator } from './auth-navigator';

const Stack = createStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: [],
  config: {
    screens: {
      App: {
        screens: {
          main: mainScreens,
        },
      },
    },
  },
};

const AppNavigator: FC = () => {
  useEffect(() => {
    const subscription = onChanges.subscribe(() => syncService.sync());

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <MainNavigator />;
};

export const Root = () => {
  const userId = useSetting('userId');
  const theme = useDynamicValue(themeValue);

  useEffect(() => {
    enableScreens();
  }, []);

  return (
    <NavigationContainer linking={linking} theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardOverlayEnabled: false,
          gestureEnabled: false,
          animationTypeForReplace: userId ? 'push' : 'pop',
        }}
      >
        {!!userId && <Stack.Screen name='App' component={AppNavigator} />}
        {!userId && <Stack.Screen name='Auth' component={AuthNavigator} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const themeValue = new DynamicValue<Theme>(
  {
    dark: false,
    colors: {
      primary: light.Primary,
      background: light.Background,
      card: light.Background,
      text: light.PrimaryText,
      border: light.Border,
      notification: light.ErrorText,
    },
  },
  {
    dark: true,
    colors: {
      primary: dark.Primary,
      background: dark.Background,
      card: dark.Background,
      text: dark.PrimaryText,
      border: dark.Border,
      notification: dark.ErrorText,
    },
  },
);
