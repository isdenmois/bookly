import React, { FC, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LinkingOptions, NavigationContainer, Theme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { DynamicValue, useDynamicValue } from 'react-native-dynamic';

import { light, dark } from 'types/colors';
import { useSetting } from 'services/settings';
import { LoginScreen } from 'screens/login/login.screen';
import { onChanges } from 'store';
import { syncService } from 'services';

import { RootRoutes } from './routes';
import { MainNavigator, mainScreens } from './main-navigator';
import { ModalNavigator } from './modal-navigator';

const Stack = createStackNavigator();

const linking: LinkingOptions = {
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

const AuthStack = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator headerMode='none'>
      <AuthStack.Screen name='login' component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

const RootStack = createStackNavigator();
const AppNavigator: FC = () => {
  useEffect(() => {
    const subscription = onChanges.subscribe(() => syncService.sync());

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <RootStack.Navigator
      headerMode='none'
      screenOptions={{
        animationEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}
      mode='modal'
    >
      <RootStack.Screen name={RootRoutes.Main} component={MainNavigator} />
      <RootStack.Screen name={RootRoutes.Modal} component={ModalNavigator} />
    </RootStack.Navigator>
  );
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
        headerMode='none'
        screenOptions={{
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
