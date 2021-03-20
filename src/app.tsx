import React from 'react';
import { ColorSchemeProvider } from 'react-native-dynamic';

import { StatusBarColor } from 'components/status-bar-color';
import { MultiProvider } from 'utils/multi-provider';
import { Initializator } from 'services/initializator';
import { Root } from 'navigation';

const providers = [ColorSchemeProvider];

export default function App() {
  return (
    <MultiProvider providers={providers}>
      <Initializator>
        <StatusBarColor />
        <Root />
      </Initializator>
    </MultiProvider>
  );
}
