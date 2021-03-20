import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

import { syncService } from 'services';
import { loadLocalSettings } from './settings-sync';
import { i18n } from './i18n';

export const Initializator = ({ children }) => {
  const [initing, setIniting] = useState(true);

  useEffect(() => {
    init().finally(() => {
      setIniting(false);
      SplashScreen?.hide();
    });
  }, []);

  if (initing) {
    return null;
  }

  return children;
};

async function init() {
  await Promise.all([loadLocalSettings(), i18n.init()]);

  sync();
}

async function sync() {
  const lastSync: number = +(await AsyncStorage.getItem('lastSync')) || 0;
  const hour = 60 * 60 * 1000;
  const now = Date.now();

  if (now - lastSync > hour) {
    await syncService.sync();
    AsyncStorage.setItem('lastSync', now.toString());
  }
}
