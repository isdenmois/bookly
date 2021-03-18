import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => require('./config/root/root').default);

// if (__DEV__) {
//   console.disableYellowBox = true;
//   require('why-did-you-update').whyDidYouUpdate(require('react'), { exclude: /^YellowBox/ });
// }
