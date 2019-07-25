import { NavigationActions, StackActions, NavigationScreenProp, NavigationParams } from 'react-navigation';

export class Navigation {
  navigator: NavigationScreenProp<any>;

  setRef = ref => (this.navigator = ref);

  navigate(routeName: string, params) {
    return this.navigator.dispatch(NavigationActions.navigate({ routeName, params }));
  }

  pop = (n?: number, immediate?: boolean) => this.navigator.dispatch(StackActions.pop({ n, immediate }));

  push(routeName: string, params?: NavigationParams) {
    return this.navigator.dispatch(StackActions.push({ routeName, params }));
  }
}