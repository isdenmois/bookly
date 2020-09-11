import _ from 'lodash';
import { createBrowserApp } from '@react-navigation/web';
import { createStackNavigator } from 'react-navigation-stack';

export const createApp = nav => {
  const { getPathAndParamsForState, getActionForPathAndParams } = nav.router;

  nav.router.getPathAndParamsForState = state => {
    const res = getPathAndParamsForState(state);

    if (res?.path.startsWith('/modal')) return null;

    return res;
  };

  nav.router.getActionForPathAndParams = (path, params) => {
    const removeParams = action => {
      if (action.action) {
        action.params = {};
        removeParams(action.action);
      }

      return action;
    };

    return removeParams(getActionForPathAndParams(path, params));
  };

  return createBrowserApp(nav, { history: 'hash' });
};

export function createStackPersistNavigator(stack, options) {
  return createStackNavigator(stack, options);
}
