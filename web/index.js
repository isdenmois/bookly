import { AppRegistry, ToastAndroid } from 'react-native';
import { name as appName } from '../app.json';
import App from '../src/app';
import { Workbox, messageSW } from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  const reload = () => {
    alert(`Version ${process.env.VERSION} has installed. The app will reload...`);
    window.location.reload();
  };
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.meta === 'workbox-broadcast-update') {
      reload();
    }
  });
  let registration;

  const showSkipWaitingPrompt = () => {
    wb.addEventListener('controlling', reload);
    if (registration && registration.waiting) {
      messageSW(registration.waiting, { type: 'SKIP_WAITING' });
    }
  };

  wb.addEventListener('waiting', showSkipWaitingPrompt);
  wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

  wb.register().then(r => (registration = r));
  window.wb = wb;
}

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
