import { AppRegistry, Platform } from 'react-native';
import App from './config/root/root';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, { rootTag: document.getElementById('app') });
}

// if (__DEV__ && Platform.OS !== 'web') {
//   require('./dev-tools/fetch');
//   //  не забудь adb reverse tcp:9090 tcp:9090
//   require('./dev-tools/reactotron');
// }

// // не забудь adb reverse tcp:6006 tcp:6006
// require('./dev-tools/storybook');
// require('react-native-splash-screen').default.hide();
