import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './config/root/root';
import { name as appName } from './app.json';

if (!global.Proxy) {
  require('proxy-polyfill');
}

AppRegistry.registerComponent(appName, () => App);

// if (__DEV__ && Platform.OS !== 'web') {
//   require('./dev-tools/fetch');
//   //  не забудь adb reverse tcp:9090 tcp:9090
//   require('./dev-tools/reactotron');
// }

// // не забудь adb reverse tcp:6006 tcp:6006
// require('./dev-tools/storybook');
// require('react-native-splash-screen').default.hide();
