import React, { FC, useEffect, useMemo, useState } from 'react';
import { Dimensions, TextStyle, ViewStyle } from 'react-native';
import { Portal } from '@gorhom/portal';
import { DynamicStyleSheet } from 'react-native-dynamic';
import Animated, { Extrapolate } from 'react-native-reanimated';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import type { Scene } from 'react-native-tab-view/src/types';

import { dynamicColor, useSColor } from 'types/colors';
import { TABS_HEIGHT, useCoordinator } from './coordinator-context';

interface Props {
  initialTab: number;
  tabs: Route[];
  extraProps: any;
  top?: number;
}

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const WINDOW_HEIGHT = Dimensions.get('window').height;

export const CoordinatorTabs: FC<Props> = ({ tabs, initialTab, extraProps = {}, top = 68 }) => {
  const { s, color } = useSColor(ds);
  const { ref, onScroll, headerHeight, onScrollEnd, onTabChange } = useCoordinator();

  const scrollStyles = useMemo(() => {
    if (headerHeight === 0) {
      return {
        style: { flexGrow: 1 },
        contentContainerStyle: {
          flexGrow: 1,
        },
      };
    }

    return {
      style: {
        flexGrow: 1,
        height: WINDOW_HEIGHT - headerHeight,
      },
      contentContainerStyle: {
        flexGrow: 1,
        paddingTop: headerHeight + TABS_HEIGHT,
        minHeight: WINDOW_HEIGHT + headerHeight - top,
      },
    };
  }, [headerHeight]);

  const renderTabBar = props => {
    return (
      <AnimatedTabBar top={top}>
        <TabBar
          {...props}
          scrollEnabled
          getLabelText={getLabelText}
          activeColor={color.PrimaryText}
          inactiveColor={color.PrimaryText}
          indicatorStyle={s.indicator}
          labelStyle={s.label}
          tabStyle={s.tabBar}
          style={s.tab}
        />
      </AnimatedTabBar>
    );
  };
  const renderScene = ({ route }: Scene<Route & { component: any }>) => {
    const Component = route.component;

    return (
      <Animated.ScrollView
        ref={node => ref(node, route.key)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        showsVerticalScrollIndicator={false}
        {...scrollStyles}
      >
        <Component tab={route.key} {...extraProps} />
      </Animated.ScrollView>
    );
  };

  const [state, setState] = useState(() => ({ index: initialTab, routes: tabs }));
  const setIndex = index => {
    setState({ ...state, index });
    onTabChange(tabs[index]?.key);
  };

  useEffect(() => {
    onTabChange(tabs[0].key);
  }, []);

  return (
    <TabView
      lazy
      navigationState={state}
      renderTabBar={renderTabBar}
      renderScene={renderScene as any}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
};

function AnimatedTabBar({ children, top }) {
  const { headerHeight, scrollY } = useCoordinator();

  const style: any = useMemo(() => {
    if (headerHeight === 0) {
      return {
        zIndex: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      };
    }

    return {
      zIndex: 3,
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, headerHeight - top - 1],
            outputRange: [headerHeight, top],
            extrapolate: Extrapolate.CLAMP,
          }),
        },
      ],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      paddingBottom: 10,
    };
  }, [headerHeight]);

  return (
    <Portal hostName='pinned'>
      <Animated.View style={style}>{children}</Animated.View>
    </Portal>
  );
}

function getLabelText(scene: Scene<Route>) {
  return scene.route.title;
}

const ds = new DynamicStyleSheet({
  indicator: {
    backgroundColor: dynamicColor.Primary,
    opacity: 1,
  } as ViewStyle,
  label: {
    fontSize: 18,
    textTransform: 'none',
  } as TextStyle,
  tabBar: {
    paddingVertical: 5,
    minHeight: 10,
    width: 'auto',
  } as ViewStyle,
  tab: {
    backgroundColor: dynamicColor.Background,
    zIndex: 1,
  } as ViewStyle,
});
