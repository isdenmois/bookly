import { createContext, useContext } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated from 'react-native-reanimated';

interface ICoordinatorContext {
  headerHeight: number;
  onHeaderLayout: (event: LayoutChangeEvent) => void;
  onTabChange: (key: string) => void;
  scrollY: Animated.Value<number>;
  onScroll: any;
  onScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  ref: (node: any, key: string) => void;
}

export const CoordinatorContext = createContext<ICoordinatorContext>(null);
export const useCoordinator = (): ICoordinatorContext => useContext(CoordinatorContext);

export const PINNED_HEIGHT = 80;
export const TABS_HEIGHT = 46;
