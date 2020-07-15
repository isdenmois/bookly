import _ from 'lodash';
import { createBrowserApp } from '@react-navigation/web';
import { createStackNavigator } from 'react-navigation-stack';
import { session } from 'services/session';

const PERSISTENCE_KEY = 'REACT_DEV_NAVIGATION';
const PERSISTENCE_TIME = `${PERSISTENCE_KEY}_TIME`;
const SESSION_EXPIRE = 30; // Minutes
let initState = null;

export const createApp = input => createBrowserApp(input, { history: 'hash' });
export function createStackPersistNavigator(stack, options) {
  const nav = createStackNavigator(stack, options);
  const { getPathAndParamsForState, getActionForPathAndParams, getStateForAction } = nav.router;

  nav.router.getPathAndParamsForState = function (state) {
    if (session.persistState && !state.isTransitioning && !_.isEqual(initState, state)) {
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      localStorage.setItem(PERSISTENCE_TIME, getMinute().toString());
      initState = state;
    }

    return getPathAndParamsForState(state);
  };

  nav.router.getActionForPathAndParams = function (path, params) {
    return session.persistState ? null : getActionForPathAndParams(path, params);
  };

  nav.router.getStateForAction = function (action, state) {
    if (session.persistState && !state) {
      try {
        const startTime = localStorage.getItem(PERSISTENCE_TIME);
        const duration = getMinute() - +startTime;

        if (duration && duration < SESSION_EXPIRE) {
          initState = JSON.parse(localStorage.getItem(PERSISTENCE_KEY));

          return initState;
        }
      } catch (e) {}
    }

    return getStateForAction(action, state);
  };

  return nav;
}

function getMinute() {
  return Math.round(Date.now() / 1000 / 60);
}
