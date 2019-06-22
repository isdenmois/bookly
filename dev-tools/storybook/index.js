import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import SplashScreen from 'react-native-splash-screen';
import { name as appName } from '../../app.json';

// import './rn-addons';

// import stories
configure(() => require('components/stories'));

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({ port: 6006, onDeviceUI: true });

class StorybookUIHMRRoot extends React.Component {
  constructor(props) {
    super(props);

    SplashScreen.hide();
  }

  render() {
    return <StorybookUIRoot />;
  }
}

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIHMRRoot);

export default StorybookUIHMRRoot;
