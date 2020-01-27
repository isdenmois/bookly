import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => require('./config/root/root').default);

// if (__DEV__) {
//   console.disableYellowBox = true;
//   require('why-did-you-update').whyDidYouUpdate(require('react'), { exclude: /^YellowBox/ });
// }

if (__DEV__) {
  // require('./dev-tools/fetch');
  //  не забудь adb reverse tcp:9090 tcp:9090
  require('./dev-tools/reactotron');
}
