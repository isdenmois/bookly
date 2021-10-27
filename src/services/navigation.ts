import { createRef } from 'react';
import { MainNavigationProp, MainRoutes, ModalParamList, ModalRoutes } from 'navigation/routes';

const navigationRef = createRef<any>();

export function setNavigation(navigation) {
  navigationRef.current = navigation;
}

export const getNavigation = () => navigationRef.current as MainNavigationProp<MainRoutes.Home>;
export const openModal = <RouteName extends ModalRoutes>(screen: RouteName, params?: ModalParamList[RouteName]) =>
  navigationRef.current.push(screen, params);
