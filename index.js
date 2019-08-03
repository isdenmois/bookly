import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

if (!global.Proxy) {
  require('proxy-polyfill');
}

AppRegistry.registerComponent(appName, () => require('./config/root/root').default);

// if (__DEV__ && Platform.OS !== 'web') {
//   require('./dev-tools/fetch');
//   //  не забудь adb reverse tcp:9090 tcp:9090
//   require('./dev-tools/reactotron');
// }
