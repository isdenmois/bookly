import React, { FC, useMemo } from 'react';
import { Portal } from '@gorhom/portal';
import Animated, { Extrapolate } from 'react-native-reanimated';
import { PINNED_HEIGHT, useCoordinator } from './coordinator-context';

export const CoordinatorHeader: FC = ({ children }) => {
  const { headerHeight, onHeaderLayout, scrollY } = useCoordinator();
  const style: any = useMemo(() => {
    const COLLAPSE_HEIGHT = headerHeight - PINNED_HEIGHT;
    if (headerHeight === 0) {
      return {};
    }

    return {
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [-1, 0, COLLAPSE_HEIGHT, COLLAPSE_HEIGHT + 1],
            outputRange: [0, 0, -COLLAPSE_HEIGHT, -COLLAPSE_HEIGHT],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
      left: 0,
      right: 0,
      position: 'absolute',
      top: 0,
      zIndex: 1,
    };
  }, [headerHeight]);

  return (
    <Animated.View style={style} onLayout={onHeaderLayout}>
      {children}
    </Animated.View>
  );
};

interface CollapsibleProps {
  title: string;
}

export const CoordinatorCollapsible: FC<CollapsibleProps> = ({ children, title }) => {
  const { headerHeight, onHeaderLayout, scrollY } = useCoordinator();
  const style = useMemo(() => {
    if (headerHeight === 0) {
      return {};
    }
    return {
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, headerHeight],
            outputRange: [0, -headerHeight],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
    };
  }, [headerHeight]);

  return <Animated.View style={style}>{children}</Animated.View>;
};

export const CoordinatorPinned: FC = ({ children }) => {
  const { headerHeight, scrollY } = useCoordinator();
  const style: any = useMemo(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: PINNED_HEIGHT,
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, 32, 33],
            outputRange: [-PINNED_HEIGHT, -PINNED_HEIGHT, 0],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
      zIndex: 2,
      opacity: scrollY.interpolate({
        inputRange: [0, 33, PINNED_HEIGHT],
        outputRange: [0, 0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    };
  }, [headerHeight]);

  return (
    <Portal hostName='pinned'>
      <Animated.View style={style}>{children}</Animated.View>
    </Portal>
  );
};
