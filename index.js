import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';

LogBox.ignoreLogs(['Non-serializable values were found']);
AppRegistry.registerComponent(appName, () => require('./src/app').default);
