import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from 'screens/login/login.screen';

const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name='login' component={LoginScreen} />
    </AuthStack.Navigator>
  );
};
