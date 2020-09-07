import _ from 'lodash';
import { createBrowserApp } from '@react-navigation/web';
import { createStackNavigator } from 'react-navigation-stack';
import { session } from 'services/session';

const PERSISTENCE_KEY = 'REACT_DEV_NAVIGATION';
const PERSISTENCE_TIME = `${PERSISTENCE_KEY}_TIME`;
const SESSION_EXPIRE = 30; // Minutes
let initState = null;

export const createApp = nav => {
  const { getPathAndParamsForState } = nav.router;

  nav.router.getPathAndParamsForState = state => {
    const res = getPathAndParamsForState(state);

    if (res?.path.startsWith('/modal')) return null;

    return res;
  };

  return createBrowserApp(nav, { history: 'hash' });
};

export function createStackPersistNavigator(stack, options) {
  const nav = createStackNavigator(stack, options);
  const { getPathAndParamsForState, getActionForPathAndParams, getStateForAction } = nav.router;
  const indices = Object.keys(stack);

  nav.router.getPathAndParamsForState = function (state) {
    if (session.persistState && !state.isTransitioning) {
      saveState(state, indices);
    }

    return getPathAndParamsForState(state);
  };

  nav.router.getActionForPathAndParams = function (path, params) {
    return session.persistState ? null : getActionForPathAndParams(path, params);
  };

  nav.router.getStateForAction = function (action, state) {
    if (session.persistState && !state && (initState = getState(indices))) {
      return initState;
    }

    return getStateForAction(action, state);
  };

  return nav;
}

function saveState(state, indices) {
  state = _.map(state.routes?.slice(1), r => pickRoute(r, indices));

  if (state.length < 1 && localStorage.getItem(PERSISTENCE_TIME)) {
    localStorage.removeItem(PERSISTENCE_KEY);
    localStorage.removeItem(PERSISTENCE_TIME);
    initState = null;
  } else if (!_.isEqual(initState, state)) {
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
    localStorage.setItem(PERSISTENCE_TIME, getMinute().toString());
    initState = state;
  }
}

function getState(indices) {
  const startTime = localStorage.getItem(PERSISTENCE_TIME);
  const duration = getMinute() - +startTime;

  if (startTime && duration < SESSION_EXPIRE) {
    try {
      const home = indices.indexOf('Home');
      const routes = [home]
        .concat(JSON.parse(localStorage.getItem(PERSISTENCE_KEY)))
        .map((r, i) => restoreRoute(r, i, indices));
      const state = {
        index: routes.length - 1,
        isTransitioning: false,
        routeName: 'MainStack',
        key: 'MainStack-0',
        routes,
      };

      return state;
    } catch (e) {}
  }
}

function pickRoute(route, indices) {
  route = omitNil(route);
  route.key = indices.indexOf(route.routeName);

  if (Object.keys(route).length === 2) {
    return route.key;
  }

  if (route.params) {
    route.params = omitNil(route.params);
  }

  return _.omit(route, 'routeName');
}

function restoreRoute(route, i, indices) {
  if (_.isNumber(route)) {
    route = { key: route };
  }

  const routeName = indices[route.key];

  route.key = `${routeName}-${i}`;
  route.routeName = routeName;

  return route;
}

function omitNil(obj) {
  return _.omitBy(obj, _.isNil);
}

function getMinute() {
  return Math.round(Date.now() / 1000 / 60);
}
