import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import { name as appName } from '../app.json';

// import './rn-addons';

// import stories
configure(() => {
  require('../../src/components/avatar/avatar.stories');
  require('../../src/components/book-item/book-item.stories');
  require('../../src/components/button/button.stories');
  require('../../src/components/card/card.stories');
  require('../../src/components/counter/counter.stories');
  require('../../src/components/list-item/list-item.stories');
  require('../../src/components/search-bar/search-bar.stories');
  require('../../src/components/switcher/switcher.stories');
  require('../../src/components/text/text.stories');
  require('../../src/components/thumbnail/thumbnail.stories');
}, module);

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

class StorybookUIHMRRoot extends React.Component {
  render() {
    return <StorybookUIRoot />;
  }
}

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(appName, () => StorybookUIHMRRoot);

export default StorybookUIHMRRoot;
