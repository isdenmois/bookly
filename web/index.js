import { AppRegistry, ToastAndroid } from 'react-native';
import { name as appName } from '../app.json';
import App from '../config/root/root';

// Generate required css
import faSolid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import faRegular from 'react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
const iconFontStyles = `@font-face {
  src: url(${faSolid});
  font-family: FontAwesome5_Solid;
}
@font-face {
  src: url(${faRegular});
  font-family: FontAwesome5_Regular;
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

ToastAndroid.show = message => alert(message);

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
